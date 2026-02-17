import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Member, BlogPost, NewsItem, MetaConfig, Metric, Tool, Message, MessageStatus } from '../types';
import { INITIAL_MEMBERS, INITIAL_BLOG_POSTS, INITIAL_NEWS, DEFAULT_META_TAGS, INITIAL_METRICS, INITIAL_TOOLS } from '../constants';
import { db, auth } from './firebase';
import { sendContactNotification, sendReplyEmail } from './emailService';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";


interface DataContextType {
  members: Member[];
  blogPosts: BlogPost[];
  newsItems: NewsItem[];
  metaTags: MetaConfig;
  metrics: Metric[];
  tools: Tool[];
  messages: Message[];
  internalEmails: string[];
  loading: boolean; // Adicionado para indicar carregamento inicial

  addMember: (member: Member) => void;
  updateMember: (id: string, updatedMember: Member) => void;
  removeMember: (id: string) => void;

  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (id: string, updatedPost: BlogPost) => void;
  removeBlogPost: (id: string) => void;

  addNewsItem: (item: NewsItem) => void;
  updateNewsItem: (id: string, updatedItem: NewsItem) => void;
  removeNewsItem: (id: string) => void;

  updateMetaTags: (newTags: MetaConfig) => void;

  addMetric: (metric: Metric) => void;
  removeMetric: (id: string) => void;

  addTool: (tool: Tool) => void;
  removeTool: (id: string) => void;

  addMessage: (msg: Omit<Message, 'id' | 'status' | 'createdAt'>) => void;
  replyToMessage: (id: string, reply: string) => Promise<boolean>;
  updateMessageStatus: (id: string, status: MessageStatus) => void;
  removeMessage: (id: string) => void;
  updateInternalEmails: (emails: string[]) => void;

  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (newPass: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  // Helper to load from cache
  const loadCache = <T,>(key: string, fallback: T): T => {
    try {
      const cached = localStorage.getItem(`rc_${key}`);
      return cached ? JSON.parse(cached) : fallback;
    } catch (e) {
      console.warn(`[RC+] Erro ao ler cache para ${key}:`, e);
      return fallback;
    }
  };

  const [members, setMembers] = useState<Member[]>(() => loadCache('members', []));
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => loadCache('blogPosts', []));
  const [newsItems, setNewsItems] = useState<NewsItem[]>(() => loadCache('newsItems', []));
  const [tools, setTools] = useState<Tool[]>(() => loadCache('tools', []));
  const [metaTags, setMetaConfig] = useState<MetaConfig>(() => loadCache('metaTags', DEFAULT_META_TAGS));
  const [metrics, setMetrics] = useState<Metric[]>(() => loadCache('metrics', []));
  const [messages, setMessages] = useState<Message[]>([]);
  const [internalEmails, setInternalEmails] = useState<string[]>(['diretoria@conselhomais.com.br']);

  // Se já temos dados no cache, não precisamos mostrar o loading inicial
  const hasCache = members.length > 0 || blogPosts.length > 0;
  const [loading, setLoading] = useState(!hasCache);

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('RC2025+');

  // Monitorar estado de autenticação do Firebase
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        console.log("[RC+] Usuário autenticado:", user.email);
        setIsAdmin(true);
      } else {
        console.log("[RC+] Usuário desconectado.");
        setIsAdmin(false);
      }
    });
    return () => unsubAuth();
  }, []);

  // Real-time synchronization with Firestore - PUBLIC DATA
  useEffect(() => {
    console.log("[RC+] Iniciando DataProvider (Dados Públicos)...");

    // List of collections we consider critical for initial load
    const collectionsToLoad = ['members', 'blogPosts', 'newsItems', 'tools', 'metaTags'];
    let loadedcount = 0;

    const checkLoadingComplete = () => {
      loadedcount++;
      // Se não tínhamos cache, liberamos o loading assim que os dados chegarem
      if (loading && loadedcount >= collectionsToLoad.length) {
        console.log("[RC+] Dados iniciais recebidos. Liberando UI.");
        setLoading(false);
      }
    };

    const unsubs = [
      onSnapshot(collection(db, 'members'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ ...doc.data() } as Member));
        setMembers(data);
        localStorage.setItem('rc_members', JSON.stringify(data));
        checkLoadingComplete();
      }),
      onSnapshot(query(collection(db, 'blogPosts'), orderBy('date', 'desc')), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ ...doc.data() } as BlogPost));
        setBlogPosts(data);
        localStorage.setItem('rc_blogPosts', JSON.stringify(data));
        checkLoadingComplete();
      }),
      onSnapshot(query(collection(db, 'newsItems'), orderBy('date', 'desc')), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ ...doc.data() } as NewsItem));
        setNewsItems(data);
        localStorage.setItem('rc_newsItems', JSON.stringify(data));
        checkLoadingComplete();
      }),
      onSnapshot(collection(db, 'tools'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ ...doc.data() } as Tool));
        setTools(data);
        localStorage.setItem('rc_tools', JSON.stringify(data));
        checkLoadingComplete();
      }),
      onSnapshot(doc(db, 'config', 'metaTags'), (doc) => {
        if (doc.exists()) {
          const data = doc.data() as MetaConfig;
          setMetaConfig(data);
          localStorage.setItem('rc_metaTags', JSON.stringify(data));
        }
        checkLoadingComplete();
      }),
    ];

    // Safety timeout: apenas se estiver travado no loading
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.warn("[RC+] Timeout de segurança. Liberando UI (pode estar vazia).");
        setLoading(false);
      }
    }, 5000);

    return () => {
      console.log("[RC+] Removendo listeners públicos.");
      clearTimeout(safetyTimeout);
      unsubs.forEach(unsub => unsub());
    };
  }, []);

  // Real-time synchronization with Firestore - ADMIN DATA
  useEffect(() => {
    if (!isAdmin) return;

    console.log("[RC+] Iniciando Listeners Administrativos...");

    const unsubs = [
      onSnapshot(collection(db, 'metrics'), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ ...doc.data() } as Metric));
        setMetrics(data.length > 0 ? data : INITIAL_METRICS);
      }),
      onSnapshot(query(collection(db, 'messages'), orderBy('createdAt', 'desc')), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ ...doc.data() } as Message));
        setMessages(data);
      }),
      onSnapshot(doc(db, 'config', 'internalEmails'), (doc) => {
        const data = doc.exists() ? (doc.data() as any).emails || [] : [];
        console.log('[RC+] Firestore retornou e-mails internos:', data);
        setInternalEmails(data);
      })
    ];

    return () => {
      console.log("[RC+] Removendo listeners administrativos.");
      unsubs.forEach(unsub => unsub());
    };
  }, [isAdmin]);

  const addMember = async (member: Member) => {
    await setDoc(doc(db, 'members', member.id), member);
  };
  const updateMember = async (id: string, updatedMember: Member) => {
    await updateDoc(doc(db, 'members', id), updatedMember as any);
  };
  const removeMember = async (id: string) => {
    await deleteDoc(doc(db, 'members', id));
  };

  const addBlogPost = async (post: BlogPost) => {
    await setDoc(doc(db, 'blogPosts', post.id), post);
  };
  const updateBlogPost = async (id: string, updatedPost: BlogPost) => {
    await updateDoc(doc(db, 'blogPosts', id), updatedPost as any);
  };
  const removeBlogPost = async (id: string) => {
    await deleteDoc(doc(db, 'blogPosts', id));
  };

  const addNewsItem = async (item: NewsItem) => {
    await setDoc(doc(db, 'newsItems', item.id), item);
  };
  const updateNewsItem = async (id: string, updatedItem: NewsItem) => {
    await updateDoc(doc(db, 'newsItems', id), updatedItem as any);
  };
  const removeNewsItem = async (id: string) => {
    await deleteDoc(doc(db, 'newsItems', id));
  };

  const addTool = async (tool: Tool) => {
    await setDoc(doc(db, 'tools', tool.id), tool);
  };
  const removeTool = async (id: string) => {
    await deleteDoc(doc(db, 'tools', id));
  };

  const updateMetaTags = async (newTags: MetaConfig) => {
    await setDoc(doc(db, 'config', 'metaTags'), newTags);
  };

  const addMetric = async (metric: Metric) => {
    await setDoc(doc(db, 'metrics', metric.id), metric);
  };
  const removeMetric = async (id: string) => {
    await deleteDoc(doc(db, 'metrics', id));
  };

  const addMessage = async (msgData: Omit<Message, 'id' | 'status' | 'createdAt'>) => {
    const newMessageId = Date.now().toString();
    const newMessage: Message = {
      ...msgData,
      id: newMessageId,
      status: MessageStatus.NEW,
      createdAt: new Date().toISOString(),
    };

    // 1. Salvar no Firestore
    await setDoc(doc(db, 'messages', newMessageId), newMessage);

    // 2. Enviar Notificações via EmailJS
    try {
      // Filtrar e-mails vazios e enviar para todos os destinatários configurados
      const validEmails = internalEmails.filter(email => email && email.trim() !== '');
      if (validEmails.length > 0) {
        await sendContactNotification(newMessage, validEmails);
        await updateDoc(doc(db, 'messages', newMessageId), {
          notifiedAt: new Date().toISOString(),
          notifiedSenderAt: new Date().toISOString()
        });
        console.log(`[RC+] Notificações enviadas para ${validEmails.length} destinatário(s):`, validEmails);
      } else {
        console.warn("[RC+] Nenhum e-mail de notificação configurado!");
      }
    } catch (e) {
      console.error("[RC+] Erro ao disparar e-mails via EmailJS:", e);
    }
  };

  const replyToMessage = async (id: string, replyText: string) => {
    try {
      // 1. Buscar dados da mensagem original para o e-mail
      const msg = messages.find(m => m.id === id);
      if (!msg) return false;

      // 2. Enviar e-mail de resposta
      await sendReplyEmail({ ...msg, reply: replyText });

      // 3. Atualizar Firestore
      await updateDoc(doc(db, 'messages', id), {
        reply: replyText,
        status: MessageStatus.RESPONDED,
        respondedAt: new Date().toISOString()
      });
      return true;
    } catch (e) {
      console.error("Erro ao responder mensagem:", e);
      return false;
    }
  };

  const updateMessageStatus = async (id: string, status: MessageStatus) => {
    await updateDoc(doc(db, 'messages', id), { status });
  };

  const removeMessage = async (id: string) => {
    await deleteDoc(doc(db, 'messages', id));
  };

  const updateInternalEmails = async (emails: string[]) => {
    const cleaned = emails.map(e => e.trim()).filter(e => e !== '');
    console.log('[RC+] Salvando e-mails internos:', cleaned);

    // Validação: não salvar se o array estiver vazio
    if (cleaned.length === 0) {
      console.warn('[RC+] Tentativa de salvar array vazio de e-mails bloqueada');
      return;
    }

    try {
      await setDoc(doc(db, 'config', 'internalEmails'), { emails: cleaned });
      console.log('[RC+] E-mails salvos com sucesso no Firestore');
    } catch (error) {
      console.error('[RC+] Erro ao salvar e-mails:', error);
    }
  };

  const login = async (password: string) => {
    const email = "admin@redeconselho.plus";

    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          return true;
        } catch (createError: any) {
          if (createError.code === 'auth/email-already-in-use') {
            return false;
          }
        }
      }
      return false;
    }
  };

  const logout = () => {
    signOut(auth);
  };

  const changePassword = (newPass: string) => setAdminPassword(newPass);

  return (
    <DataContext.Provider value={{
      members, blogPosts, newsItems, metaTags, metrics, tools, messages, internalEmails,
      addMember, updateMember, removeMember,
      addBlogPost, updateBlogPost, removeBlogPost,
      addNewsItem, updateNewsItem, removeNewsItem,
      updateMetaTags,
      addMetric, removeMetric,
      addTool, removeTool,
      addMessage, replyToMessage, updateMessageStatus, removeMessage, updateInternalEmails,
      isAdmin, login, logout, changePassword,
      loading
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
