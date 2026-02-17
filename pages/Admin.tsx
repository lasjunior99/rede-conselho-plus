
import React, { useState, useEffect } from 'react';
import { useData } from '../services/dataContext';
import { CATEGORIES, MetaConfig, Metric, Tool, Member, BlogPost, NewsItem, Message, MessageStatus } from '../types';
import { Lock, Plus, Trash2, Edit2, LayoutDashboard, FileText, Newspaper, Users, Globe, BarChart, Briefcase, Download, Link as LinkIcon, Eye, EyeOff, ShieldAlert, Upload, XCircle, Save, FileSpreadsheet, ChevronUp, ChevronDown, Instagram, Mail, MessageSquare, ArrowRight, Search, Filter } from 'lucide-react';
import { jsPDF } from 'jspdf';

const Admin: React.FC = () => {
  const {
    isAdmin, login, logout, changePassword,
    members, addMember, updateMember, removeMember,
    blogPosts, addBlogPost, updateBlogPost, removeBlogPost,
    newsItems, addNewsItem, updateNewsItem, removeNewsItem,
    tools, addTool, removeTool,
    metaTags, updateMetaTags,
    metrics, addMetric, removeMetric,
    messages, replyToMessage, updateMessageStatus, removeMessage,
    internalEmails, updateInternalEmails
  } = useData();

  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Tab State
  type AdminTab = 'MEMBERS' | 'BLOG' | 'NEWS' | 'TOOLS' | 'MESSAGES' | 'METRICS' | 'SEO' | 'SETTINGS';
  const [activeTab, setActiveTab] = useState<AdminTab>('MEMBERS');



  // Editing States
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);

  // Message Selection
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [msgSearchTerm, setMsgSearchTerm] = useState('');
  const [msgFilterStatus, setMsgFilterStatus] = useState<string>('Todos');

  // Form States
  const initialMemberState = { name: '', role: '', bio: '', specialization: [] as string[], photoUrl: '', cvUrl: '', linkedinUrl: '', email: '', profileUrl: '' };
  const [newMember, setNewMember] = useState(initialMemberState);

  const initialPostState = { title: '', author: '', content: '', excerpt: '', imageUrl: '' };
  const [newPost, setNewPost] = useState(initialPostState);

  const initialNewsState = { title: '', source: '', summary: '', link: '' };
  const [newNews, setNewNews] = useState(initialNewsState);

  const [newTool, setNewTool] = useState<Tool>({ id: '', title: '', description: '', fileUrl: '', date: '' });
  const [newPassword, setNewPassword] = useState('');
  const [newMetric, setNewMetric] = useState<Metric>({ id: '', label: '', value: '' });
  const [copiedLink, setCopiedLink] = useState(false);

  // Local state for internal emails (to avoid Firestore conflicts while typing)
  const [localInternalEmails, setLocalInternalEmails] = useState<string[]>([]);
  const [isEditingEmails, setIsEditingEmails] = useState(false);
  const saveTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Sync internalEmails from context to local state ONLY when not editing
  useEffect(() => {
    if (!isEditingEmails) {
      setLocalInternalEmails(internalEmails);
    }
  }, [internalEmails, isEditingEmails]);

  // Debounced save to Firestore
  const debouncedSaveEmails = (emails: string[]) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setIsEditingEmails(true);
    console.log('[Admin] Iniciando timer de salvamento. E-mails:', emails);
    saveTimerRef.current = setTimeout(() => {
      console.log('[Admin] Timer expirado. Salvando e-mails:', emails);
      updateInternalEmails(emails);
      setIsEditingEmails(false);
    }, 5000); // Espera 5 segundos após parar de digitar
  };

  // SEO Form State
  const [seoForm, setSeoForm] = useState<MetaConfig>(metaTags);

  useEffect(() => {
    setSeoForm(metaTags);
  }, [metaTags]);

  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,Nome,Cargo,Bio,Especializacao,Email,LinkedIn,ProfileURL\n" +
      "Exemplo Nome,Conselheiro,Breve bio aqui,Governança Corporativa,exemplo@email.com,https://linkedin.com/in/exemplo,https://perfil.com";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "modelo_importacao_membros.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processFile = (file: File, type: 'IMAGE' | 'PDF'): Promise<string> => {
    return new Promise((resolve, reject) => {
      const maxSize = 20 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("O arquivo excede o limite de 20MB.");
        reject("File too big");
        return;
      }
      if (type === 'IMAGE' && !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert("Apenas imagens JPG, PNG ou WEBP são permitidas.");
        reject("Invalid type");
        return;
      }
      if (type === 'PDF' && file.type !== 'application/pdf') {
        alert("Apenas arquivos PDF são permitidos.");
        reject("Invalid type");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  };

  const handleMemberPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await processFile(e.target.files[0], 'IMAGE');
        setNewMember(prev => ({ ...prev, photoUrl: base64 }));
      } catch (err) { console.error(err); }
    }
  };

  const handleMemberCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await processFile(e.target.files[0], 'PDF');
        setNewMember(prev => ({ ...prev, cvUrl: base64 }));
      } catch (err) { console.error(err); }
    }
  };

  const handlePostImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await processFile(e.target.files[0], 'IMAGE');
        setNewPost(prev => ({ ...prev, imageUrl: base64 }));
      } catch (err) { console.error(err); }
    }
  };

  const handleAddArea = (area: string) => {
    if (area === "") return;
    if (newMember.specialization.includes(area)) {
      alert("Esta área já foi selecionada.");
      return;
    }
    if (newMember.specialization.length >= 5) {
      alert("Você pode selecionar no máximo 5 áreas de atuação.");
      return;
    }
    setNewMember(prev => ({
      ...prev,
      specialization: [...prev.specialization, area]
    }));
  };

  const handleRemoveArea = (index: number) => {
    setNewMember(prev => ({
      ...prev,
      specialization: prev.specialization.filter((_, i) => i !== index)
    }));
  };

  const handleMoveArea = (index: number, direction: 'UP' | 'DOWN') => {
    const newSpec = [...newMember.specialization];
    if (direction === 'UP' && index > 0) {
      [newSpec[index], newSpec[index - 1]] = [newSpec[index - 1], newSpec[index]];
    } else if (direction === 'DOWN' && index < newSpec.length - 1) {
      [newSpec[index], newSpec[index + 1]] = [newSpec[index + 1], newSpec[index]];
    }
    setNewMember(prev => ({ ...prev, specialization: newSpec }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(passwordInput)) setError('');
    else setError('Senha incorreta.');
  };



  const handleEditMember = (member: Member) => {
    setEditingMemberId(member.id);
    const spec = Array.isArray(member.specialization)
      ? member.specialization
      : (member.specialization ? [member.specialization as unknown as string] : []);
    setNewMember({
      name: member.name,
      role: member.role,
      bio: member.bio,
      specialization: spec,
      photoUrl: member.photoUrl,
      cvUrl: member.cvUrl || '',
      linkedinUrl: member.linkedinUrl || '',
      email: member.email || '',
      profileUrl: member.profileUrl || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEditMember = () => {
    setEditingMemberId(null);
    setNewMember(initialMemberState);
  };

  const handleSubmitMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMember.specialization.length === 0) {
      alert("Selecione pelo menos uma área de atuação.");
      return;
    }
    if (editingMemberId) {
      updateMember(editingMemberId, { ...newMember, id: editingMemberId });
      alert("Membro atualizado com sucesso!");
    } else {
      addMember({ ...newMember, id: Date.now().toString() });
      alert("Membro cadastrado com sucesso!");
    }
    handleCancelEditMember();
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPostId(post.id);
    setNewPost({
      title: post.title,
      author: post.author,
      content: post.content,
      excerpt: post.excerpt,
      imageUrl: post.imageUrl
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEditPost = () => {
    setEditingPostId(null);
    setNewPost(initialPostState);
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    const existingPost = blogPosts.find(p => p.id === editingPostId);
    const postData = {
      ...newPost,
      date: existingPost ? existingPost.date : new Date().toISOString()
    };
    if (editingPostId) {
      updateBlogPost(editingPostId, { ...postData, id: editingPostId });
      alert("Artigo atualizado com sucesso!");
    } else {
      addBlogPost({ ...postData, id: Date.now().toString() });
      alert("Artigo publicado com sucesso!");
    }
    handleCancelEditPost();
  };

  const handleEditNews = (news: NewsItem) => {
    setEditingNewsId(news.id);
    setNewNews({
      title: news.title,
      source: news.source,
      summary: news.summary,
      link: news.link || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEditNews = () => {
    setEditingNewsId(null);
    setNewNews(initialNewsState);
  };

  const handleSubmitNews = (e: React.FormEvent) => {
    e.preventDefault();
    const existingNews = newsItems.find(n => n.id === editingNewsId);
    const newsData = {
      ...newNews,
      date: existingNews ? existingNews.date : new Date().toISOString()
    };
    if (editingNewsId) {
      updateNewsItem(editingNewsId, { ...newsData, id: editingNewsId });
      alert("Notícia atualizada com sucesso!");
    } else {
      addNewsItem({ ...newsData, id: Date.now().toString() });
      alert("Notícia publicada com sucesso!");
    }
    handleCancelEditNews();
  };

  const handleAddTool = (e: React.FormEvent) => {
    e.preventDefault();
    addTool({ ...newTool, id: Date.now().toString(), date: new Date().toISOString() });
    setNewTool({ id: '', title: '', description: '', fileUrl: '', date: '' });
  };

  const handleAddMetric = (e: React.FormEvent) => {
    e.preventDefault();
    addMetric({ ...newMetric, id: Date.now().toString() });
    setNewMetric({ id: '', label: '', value: '' });
  };

  const handleUpdateSEO = (e: React.FormEvent) => {
    e.preventDefault();
    updateMetaTags(seoForm);
    alert('Meta Tags atualizadas e salvas com sucesso!');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length >= 4) {
      changePassword(newPassword);
      setNewPassword('');
      alert('Senha de Acesso Administrativo alterada com sucesso!');
    }
  };

  const handleReplyMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMessageId && replyText) {
      const success = replyToMessage(selectedMessageId, replyText);
      if (success) {
        setReplyText('');
        alert("Resposta enviada com sucesso para o remetente!");
      } else {
        alert("Erro ao processar o envio da resposta. Tente novamente.");
      }
    }
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(15, 46, 99);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(201, 160, 79);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("REDE CONSELHO+", 105, 25, { align: "center" });
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Somamos Valor com Governança", 105, 32, { align: "center" });
      doc.setTextColor(15, 46, 99);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("MANUAL EDITORIAL", 105, 60, { align: "center" });
      doc.save("Manual_Editorial_Rede_Conselho.pdf");
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar PDF.");
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesStatus = msgFilterStatus === 'Todos' || m.status === msgFilterStatus;
    const name = m.name || '';
    const email = m.email || '';
    const subject = m.subject || '';
    const matchesSearch = name.toLowerCase().includes(msgSearchTerm.toLowerCase()) ||
      email.toLowerCase().includes(msgSearchTerm.toLowerCase()) ||
      subject.toLowerCase().includes(msgSearchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });



  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 -mt-20">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-slate-100">
          <div className="flex justify-center mb-6">
            <div className="bg-brand-blue p-3 rounded-full">
              <Lock className="text-white h-6 w-6" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-brand-blue mb-6">Acesso Administrativo</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha de Acesso</label>
              <input
                type={showPassword ? "text" : "password"}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 pr-10 focus:border-brand-blue focus:outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-8 text-slate-400 hover:text-brand-blue"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-brand-blue text-white font-bold py-2 rounded hover:bg-slate-800 transition">
              Entrar no Painel
            </button>
          </form>
        </div>
      </div>
    );
  }

  const selectedMsg = messages.find(m => m.id === selectedMessageId);

  return (
    <div className="bg-slate-50 min-h-full pb-20">

      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center py-4">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-brand-blue text-white p-2 rounded mr-3">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-brand-blue">Painel de Controle</h1>
                <p className="text-xs text-slate-500">
                  Acesso Administrativo
                </p>
              </div>
            </div>

            <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-4 w-full md:w-auto overflow-x-auto">
              <nav className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
                <button onClick={() => setActiveTab('MEMBERS')} className={`px-3 py-2 rounded-md text-xs font-bold transition flex items-center ${activeTab === 'MEMBERS' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  <Users className="h-3 w-3 mr-1" /> Membros
                </button>
                <button onClick={() => setActiveTab('BLOG')} className={`px-3 py-2 rounded-md text-xs font-bold transition flex items-center ${activeTab === 'BLOG' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  <FileText className="h-3 w-3 mr-1" /> Blog
                </button>
                <button onClick={() => setActiveTab('NEWS')} className={`px-3 py-2 rounded-md text-xs font-bold transition flex items-center ${activeTab === 'NEWS' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  <Newspaper className="h-3 w-3 mr-1" /> Notícias
                </button>
                <button onClick={() => setActiveTab('MESSAGES')} className={`px-3 py-2 rounded-md text-xs font-bold transition flex items-center ${activeTab === 'MESSAGES' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  <Mail className="h-3 w-3 mr-1" /> Mensagens
                </button>
              </nav>

              <nav className="flex space-x-1 bg-brand-blue/5 p-1 rounded-lg border border-brand-blue/10">
                <button onClick={() => setActiveTab('METRICS')} className={`px-3 py-2 rounded-md text-xs font-bold transition flex items-center ${activeTab === 'METRICS' ? 'bg-brand-blue text-white shadow-sm' : 'text-brand-blue hover:bg-brand-blue/10'}`}>
                  <BarChart className="h-3 w-3 mr-1" /> Métricas
                </button>
                <button onClick={() => setActiveTab('SEO')} className={`px-3 py-2 rounded-md text-xs font-bold transition flex items-center ${activeTab === 'SEO' ? 'bg-brand-blue text-white shadow-sm' : 'text-brand-blue hover:bg-brand-blue/10'}`}>
                  <Globe className="h-3 w-3 mr-1" /> SEO
                </button>
                <button onClick={() => setActiveTab('SETTINGS')} className={`px-3 py-2 rounded-md text-xs font-bold transition flex items-center ${activeTab === 'SETTINGS' ? 'bg-brand-blue text-white shadow-sm' : 'text-brand-blue hover:bg-brand-blue/10'}`}>
                  <Lock className="h-3 w-3 mr-1" /> Config
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <>
          {/* MESSAGES TAB */}
          {activeTab === 'MESSAGES' && (
            <div className="animate-fadeIn w-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List View */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 space-y-3">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Buscar mensagens..."
                        className="w-full pl-8 pr-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:border-brand-blue"
                        value={msgSearchTerm}
                        onChange={e => setMsgSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="h-3 w-3 text-brand-gold" />
                      <select
                        className="text-xs bg-slate-50 border border-slate-200 rounded p-1 flex-grow outline-none"
                        value={msgFilterStatus}
                        onChange={e => setMsgFilterStatus(e.target.value)}
                      >
                        <option value="Todos">Todos os Status</option>
                        {Object.values(MessageStatus).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
                    <div className="max-h-[600px] overflow-y-auto">
                      {filteredMessages.length > 0 ? filteredMessages.map(msg => {
                        if (!msg || !msg.id) return null;
                        const msgName = msg.name || 'Sem Nome';
                        const msgSubject = msg.subject || 'Sem Assunto';
                        const msgStatus = msg.status || MessageStatus.NEW;
                        const msgDate = msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : '--/--/----';

                        return (
                          <button
                            key={msg.id}
                            onClick={() => setSelectedMessageId(msg.id)}
                            className={`w-full text-left p-4 border-b border-slate-50 hover:bg-slate-50 transition ${selectedMessageId === msg.id ? 'bg-blue-50 border-l-4 border-l-brand-blue' : ''}`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${msgStatus === MessageStatus.NEW ? 'bg-blue-100 text-blue-600' :
                                msgStatus === MessageStatus.RESPONDED ? 'bg-green-100 text-green-600' :
                                  'bg-slate-100 text-slate-500'
                                }`}>
                                {msgStatus}
                              </span>
                              <span className="text-[10px] text-slate-400">{msgDate}</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 truncate">{msgName}</h4>
                            <p className="text-xs text-slate-500 truncate">{msgSubject}</p>
                          </button>
                        );
                      }) : (
                        <div className="p-8 text-center text-slate-400 text-sm">Nenhuma mensagem encontrada.</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Detail & Reply View */}
                <div className="lg:col-span-2">
                  {selectedMsg ? (
                    <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full animate-fadeIn min-h-[400px]">
                      <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-brand-blue">{selectedMsg.subject}</h3>
                          <p className="text-sm text-slate-500 mt-1">De: <span className="font-semibold text-slate-700">{selectedMsg.name}</span> ({selectedMsg.email}) {selectedMsg.company && `• ${selectedMsg.company}`}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedMessageId(null)}
                            className="p-2 text-slate-400 hover:text-slate-600 rounded bg-white border border-slate-200 lg:hidden"
                            title="Fechar"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Deseja arquivar esta mensagem?')) updateMessageStatus(selectedMsg.id, MessageStatus.ARCHIVED);
                            }}
                            className="p-2 text-slate-400 hover:text-slate-600 rounded bg-white border border-slate-200"
                            title="Arquivar"
                          >
                            <Briefcase className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Excluir mensagem permanentemente?')) {
                                removeMessage(selectedMsg.id);
                                setSelectedMessageId(null);
                              }
                            }}
                            className="p-2 text-red-400 hover:text-red-600 rounded bg-white border border-slate-200"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="p-8 flex-grow space-y-8 max-h-[400px] overflow-y-auto bg-white">
                        <div className="flex items-start">
                          <div className="bg-slate-100 p-2 rounded-full mr-4"><MessageSquare className="h-5 w-5 text-slate-400" /></div>
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap flex-grow">
                            {selectedMsg.content}
                          </div>
                        </div>

                        {selectedMsg.reply && (
                          <div className="flex items-start justify-end">
                            <div className="bg-brand-blue/5 p-4 rounded-lg border border-brand-blue/10 text-brand-blue text-sm leading-relaxed whitespace-pre-wrap flex-grow mr-4 text-right">
                              <div className="text-[10px] font-bold uppercase text-brand-gold mb-2">Sua Resposta em {new Date(selectedMsg.respondedAt!).toLocaleString()}</div>
                              {selectedMsg.reply}
                            </div>
                            <div className="bg-brand-blue p-2 rounded-full"><ArrowRight className="h-5 w-5 text-white" /></div>
                          </div>
                        )}
                      </div>

                      {selectedMsg.status !== MessageStatus.RESPONDED && (
                        <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
                          <form onSubmit={handleReplyMessage} className="space-y-4">
                            <label className="block text-xs font-bold text-slate-500 uppercase">Responder Mensagem (Envia e-mail automático)</label>
                            <textarea
                              className="w-full border border-slate-300 rounded p-3 h-32 focus:outline-none focus:border-brand-blue bg-white text-sm"
                              placeholder="Escreva sua resposta aqui..."
                              value={replyText}
                              onChange={e => setReplyText(e.target.value)}
                              required
                            ></textarea>
                            <button type="submit" className="bg-brand-blue text-white font-bold py-2 px-6 rounded hover:bg-slate-800 transition shadow-sm flex items-center">
                              <Mail className="h-4 w-4 mr-2" /> Registrar e Enviar E-mail
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-white rounded-lg border-2 border-dashed border-slate-200 min-h-[400px]">
                      <Mail className="h-12 w-12 mb-4 opacity-20" />
                      <p className="font-medium">Selecione uma mensagem para visualizar detalhes</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MEMBERS TAB */}
          {activeTab === 'MEMBERS' && (
            <div className="animate-fadeIn w-full">
              <div className={`bg-white p-6 rounded-lg shadow-sm mb-8 border border-slate-100 ${editingMemberId ? 'ring-2 ring-brand-gold' : ''}`}>
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                  <h3 className="text-lg font-semibold text-brand-blue">
                    {editingMemberId ? 'Editar Membro' : 'Adicionar Novo Membro'}
                  </h3>
                  <div className="flex gap-2">
                    <button onClick={handleDownloadTemplate} className="text-xs text-brand-blue hover:text-brand-gold flex items-center bg-slate-50 px-2 py-1 rounded border border-slate-200">
                      <FileSpreadsheet className="h-3 w-3 mr-1" /> Modelo Importação
                    </button>
                    {editingMemberId && (
                      <button onClick={handleCancelEditMember} className="text-xs text-red-500 hover:underline flex items-center">
                        <XCircle className="h-3 w-3 mr-1" /> Cancelar Edição
                      </button>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSubmitMember} className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <input placeholder="Nome Completo" className="border p-2 rounded focus:outline-none focus:border-brand-gold w-full" value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} required />
                  <input placeholder="Cargo / Atuação" className="border p-2 rounded focus:outline-none focus:border-brand-gold w-full" value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value })} required />

                  <div className="col-span-1 md:col-span-2 space-y-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Áreas de Atuação (Até 5, ordem de importância)</label>
                    <div className="flex gap-2">
                      <select
                        className="flex-grow border p-2 rounded focus:outline-none focus:border-brand-gold bg-white"
                        onChange={(e) => {
                          handleAddArea(e.target.value);
                          e.target.value = "";
                        }}
                        value=""
                      >
                        <option value="">Selecione uma área para adicionar...</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      {newMember.specialization.map((area, index) => (
                        <div key={area} className="flex items-center bg-slate-50 p-2 rounded border border-slate-200 group">
                          <span className="text-xs font-bold text-brand-blue bg-brand-gold/20 w-6 h-6 flex items-center justify-center rounded-full mr-3">
                            {index + 1}
                          </span>
                          <span className="flex-grow text-sm font-medium text-slate-700">{area}</span>
                          <div className="flex items-center space-x-1">
                            <button type="button" onClick={() => handleMoveArea(index, 'UP')} disabled={index === 0} className="p-1 text-slate-400 hover:text-brand-blue disabled:opacity-30">
                              <ChevronUp className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={() => handleMoveArea(index, 'DOWN')} disabled={index === newMember.specialization.length - 1} className="p-1 text-slate-400 hover:text-brand-blue disabled:opacity-30">
                              <ChevronDown className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={() => handleRemoveArea(index)} className="p-1 text-red-400 hover:text-red-600 ml-2">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <p className="text-[10px] text-slate-400 text-right uppercase">
                        {newMember.specialization.length}/5 Áreas selecionadas
                      </p>
                    </div>
                  </div>

                  <div className="relative border border-slate-300 rounded p-2 bg-slate-50 flex items-center w-full">
                    <div className="mr-3 text-slate-400"><Upload className="h-5 w-5" /></div>
                    <div className="flex-grow">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Foto do Perfil (JPG, PNG)</label>
                      <input type="file" accept="image/jpeg, image/png, image/webp" onChange={handleMemberPhotoUpload} className="text-xs w-full" />
                    </div>
                    {newMember.photoUrl && <img src={newMember.photoUrl} alt="Preview" className="h-10 w-10 rounded-full object-cover ml-2 border" />}
                  </div>

                  <div className="relative border border-slate-300 rounded p-2 bg-slate-50 flex items-center w-full">
                    <div className="mr-3 text-slate-400"><FileText className="h-5 w-5" /></div>
                    <div className="flex-grow">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Currículo / Perfil (PDF)</label>
                      <input type="file" accept="application/pdf" onChange={handleMemberCVUpload} className="text-xs w-full" />
                    </div>
                    {newMember.cvUrl && <span className="text-xs text-green-600 font-bold ml-2">PDF OK</span>}
                  </div>

                  <input placeholder="E-mail (visível apenas p/ admin)" className="border p-2 rounded focus:outline-none focus:border-brand-gold w-full" value={newMember.email} onChange={e => setNewMember({ ...newMember, email: e.target.value })} />
                  <input placeholder="URL Perfil LinkedIn (opcional)" className="border p-2 rounded focus:outline-none focus:border-brand-gold w-full" value={newMember.linkedinUrl} onChange={e => setNewMember({ ...newMember, linkedinUrl: e.target.value })} />
                  <div className="relative flex items-center col-span-1 md:col-span-2 border border-slate-300 rounded focus-within:border-brand-gold transition-colors bg-white">
                    <div className="pl-3 text-slate-400">
                      <Instagram className="h-5 w-5" />
                    </div>
                    <input
                      placeholder="URL Perfil Instagram (opcional)"
                      className="p-2 rounded w-full focus:outline-none bg-transparent"
                      value={newMember.profileUrl}
                      onChange={e => setNewMember({ ...newMember, profileUrl: e.target.value })}
                    />
                  </div>

                  <textarea placeholder="Mini Bio (max 80 palavras)" className="border p-2 rounded col-span-1 md:col-span-2 h-24 focus:outline-none focus:border-brand-gold w-full" value={newMember.bio} onChange={e => setNewMember({ ...newMember, bio: e.target.value })} required />

                  <button type="submit" className={`col-span-1 md:col-span-2 text-white font-bold py-3 rounded transition flex justify-center items-center shadow-sm w-full ${editingMemberId ? 'bg-brand-blue hover:bg-slate-800' : 'bg-brand-gold hover:bg-yellow-600'}`}>
                    {editingMemberId ? <><Save className="h-4 w-4 mr-2" /> Atualizar Membro</> : <><Plus className="h-4 w-4 mr-2" /> Cadastrar Membro</>}
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-100 w-full">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-4 border-b font-medium text-slate-600 text-sm uppercase">Membro</th>
                      <th className="p-4 border-b font-medium text-slate-600 text-sm uppercase">Atuação</th>
                      <th className="p-4 border-b font-medium text-slate-600 text-right text-sm uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(m => {
                      if (!m || !m.id) return null;
                      const spec = Array.isArray(m.specialization) ? m.specialization.join(', ') : (m.specialization || '');
                      return (
                        <tr key={m.id} className="border-b last:border-0 hover:bg-slate-50 transition">
                          <td className="p-4 flex items-center">
                            <img src={m.photoUrl || "https://via.placeholder.com/40"} alt="" className="w-10 h-10 rounded-full mr-3 object-cover bg-slate-200 border border-slate-200" />
                            <div>
                              <div className="font-semibold text-slate-800">{m.name || 'Sem Nome'}</div>
                            </div>
                          </td>
                          <td className="p-4 text-slate-600 text-sm">
                            {spec}
                          </td>
                          <td className="p-4 text-right flex justify-end space-x-2">
                            <button onClick={() => handleEditMember(m)} className="text-brand-blue hover:text-brand-gold p-2 hover:bg-blue-50 rounded transition" title="Editar">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => removeMember(m.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded transition" title="Excluir">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'BLOG' && (
            <div className="animate-fadeIn w-full">
              <div className={`bg-white p-6 rounded-lg shadow-sm mb-8 border border-slate-100 ${editingPostId ? 'ring-2 ring-brand-gold' : ''}`}>
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                  <h3 className="text-lg font-semibold text-brand-blue">{editingPostId ? 'Editar Artigo' : 'Novo Artigo'}</h3>
                  {editingPostId && (
                    <button onClick={handleCancelEditPost} className="text-sm text-red-500 hover:underline flex items-center"><XCircle className="h-4 w-4 mr-1" /> Cancelar Edição</button>
                  )}
                </div>
                <form onSubmit={handleSubmitPost} className="grid grid-cols-1 gap-4 w-full">
                  <input placeholder="Título do Artigo" className="border p-2 rounded focus:outline-none focus:border-brand-gold w-full" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} required />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <input placeholder="Autor" className="border p-2 rounded focus:outline-none focus:border-brand-gold w-full" value={newPost.author} onChange={e => setNewPost({ ...newPost, author: e.target.value })} required />
                    <div className="relative border border-slate-300 rounded p-2 bg-slate-50 flex items-center w-full">
                      <div className="mr-3 text-slate-400"><Upload className="h-5 w-5" /></div>
                      <div className="flex-grow">
                        <label className="block text-xs font-bold text-slate-500 uppercase">Imagem de Capa</label>
                        <input type="file" accept="image/jpeg, image/png, image/webp" onChange={handlePostImageUpload} className="text-xs w-full" />
                      </div>
                      {newPost.imageUrl && <img src={newPost.imageUrl} alt="Preview" className="h-10 w-16 object-cover ml-2 border rounded" />}
                    </div>
                  </div>
                  <input placeholder="Resumo (Excerpt)" className="border p-2 rounded focus:outline-none focus:border-brand-gold w-full" value={newPost.excerpt} onChange={e => setNewPost({ ...newPost, excerpt: e.target.value })} required />
                  <textarea placeholder="Conteúdo completo" className="border p-2 rounded h-40 focus:outline-none focus:border-brand-gold w-full" value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} required />
                  <button type="submit" className={`text-white font-bold py-3 rounded transition flex justify-center items-center shadow-sm w-full ${editingPostId ? 'bg-brand-blue hover:bg-slate-800' : 'bg-brand-gold hover:bg-yellow-600'}`}>
                    {editingPostId ? <><Save className="h-4 w-4 mr-2" /> Atualizar Artigo</> : <><Plus className="h-4 w-4 mr-2" /> Publicar Artigo</>}
                  </button>
                </form>
              </div>
              <div className="space-y-4 w-full">
                {blogPosts.map(post => {
                  if (!post || !post.id) return null;
                  const postDate = post.date ? new Date(post.date).toLocaleDateString() : '--/--/----';
                  return (
                    <div key={post.id} className="bg-white p-4 rounded shadow-sm flex justify-between items-center border-l-4 border-brand-blue border border-slate-100 hover:shadow-md transition w-full">
                      <div className="flex items-center">
                        {post.imageUrl && <img src={post.imageUrl} alt="" className="h-12 w-12 object-cover rounded mr-4 bg-slate-100" />}
                        <div>
                          <h4 className="font-bold text-slate-800">{post.title || 'Sem Título'}</h4>
                          <p className="text-xs text-slate-500 mt-1">{postDate} • {post.author || 'Redação'}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => handleEditPost(post)} className="text-brand-blue hover:text-brand-gold p-2 hover:bg-blue-50 rounded transition" title="Editar"><Edit2 className="h-5 w-5" /></button>
                        <button onClick={() => removeBlogPost(post.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded transition" title="Excluir"><Trash2 className="h-5 w-5" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'NEWS' && (
            <div className="animate-fadeIn w-full">
              <div className={`bg-white p-6 rounded-lg shadow-sm mb-8 border border-slate-100 ${editingNewsId ? 'ring-2 ring-brand-gold' : ''}`}>
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                  <h3 className="text-lg font-semibold text-brand-blue">{editingNewsId ? 'Editar Notícia' : 'Nova Notícia'}</h3>
                  {editingNewsId && (
                    <button onClick={handleCancelEditNews} className="text-sm text-red-500 hover:underline flex items-center"><XCircle className="h-4 w-4 mr-1" /> Cancelar Edição</button>
                  )}
                </div>
                <form onSubmit={handleSubmitNews} className="grid grid-cols-1 gap-4 w-full">
                  <input placeholder="Título da Notícia" className="border p-2 rounded focus:outline-none focus:border-brand-gold w-full" value={newNews.title} onChange={e => setNewNews({ ...newNews, title: e.target.value })} required />
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <input placeholder="Fonte (ex: Mercado, IBGC)" className="border p-2 rounded focus:outline-none focus:border-brand-gold w-full" value={newNews.source} onChange={e => setNewNews({ ...newNews, source: e.target.value })} required />
                    <input placeholder="Link Externo" className="border p-2 rounded focus:outline-none focus:border-brand-gold w-full" value={newNews.link} onChange={e => setNewNews({ ...newNews, link: e.target.value })} />
                  </div>
                  <textarea placeholder="Resumo da notícia" className="border p-2 rounded h-24 focus:outline-none focus:border-brand-gold w-full" value={newNews.summary} onChange={e => setNewNews({ ...newNews, summary: e.target.value })} required />
                  <button type="submit" className={`text-white font-bold py-3 rounded transition flex justify-center items-center shadow-sm w-full ${editingNewsId ? 'bg-brand-blue hover:bg-slate-800' : 'bg-brand-gold hover:bg-yellow-600'}`}>
                    {editingNewsId ? <><Save className="h-4 w-4 mr-2" /> Atualizar Notícia</> : <><Plus className="h-4 w-4 mr-2" /> Publicar Notícia</>}
                  </button>
                </form>
              </div>
              <div className="space-y-4 w-full">
                {newsItems.map(news => {
                  if (!news || !news.id) return null;
                  const newsDate = news.date ? new Date(news.date).toLocaleDateString() : '--/--/----';
                  return (
                    <div key={news.id} className="bg-white p-4 rounded shadow-sm flex justify-between items-center border-l-4 border-brand-gold border border-slate-100 hover:shadow-md transition w-full">
                      <div>
                        <h4 className="font-bold text-slate-800">{news.title || 'Sem Título'}</h4>
                        <p className="text-xs text-slate-500 mt-1">{news.source || 'Geral'} • {newsDate}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => handleEditNews(news)} className="text-brand-blue hover:text-brand-gold p-2 hover:bg-blue-50 rounded transition" title="Editar"><Edit2 className="h-5 w-5" /></button>
                        <button onClick={() => removeNewsItem(news.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded transition" title="Excluir"><Trash2 className="h-5 w-5" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'TOOLS' && (
            <div className="animate-fadeIn w-full">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-slate-100">
                <h3 className="text-lg font-semibold mb-6 text-brand-blue border-b pb-2 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-brand-gold" /> Adicionar Ferramenta / Manual
                </h3>
                <form onSubmit={handleAddTool} className="grid grid-cols-1 gap-4 mb-8 w-full">
                  <input placeholder="Título do Documento" className="border p-2 rounded focus:outline-none focus:border-brand-gold w-full" value={newTool.title} onChange={e => setNewTool({ ...newTool, title: e.target.value })} required />
                  <textarea placeholder="Breve descrição" className="border p-2 rounded h-20 focus:outline-none focus:border-brand-gold w-full" value={newTool.description} onChange={e => setNewTool({ ...newTool, description: e.target.value })} required />
                  <input placeholder="URL do Arquivo PDF" className="w-full border p-2 rounded focus:outline-none focus:border-brand-gold" value={newTool.fileUrl} onChange={e => setNewTool({ ...newTool, fileUrl: e.target.value })} required />
                  <button type="submit" className="bg-brand-gold text-white font-bold py-3 rounded hover:bg-yellow-600 transition flex justify-center items-center shadow-sm w-full">
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Ferramenta
                  </button>
                </form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                  {tools.map(tool => {
                    if (!tool || !tool.id) return null;
                    return (
                      <div key={tool.id} className="border border-slate-200 rounded-lg p-0 flex flex-col hover:shadow-lg transition-shadow bg-slate-50 relative group">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={() => removeTool(tool.id)} className="bg-red-100 text-red-500 p-1.5 rounded-full hover:bg-red-500 hover:text-white transition"><Trash2 className="h-4 w-4" /></button>
                        </div>
                        <div className="bg-white p-8 flex flex-col items-center justify-center border-b border-slate-100">
                          <div className="w-16 h-16 bg-brand-blue/5 rounded-full flex items-center justify-center mb-4"><FileText className="h-8 w-8 text-brand-blue" /></div>
                          <h4 className="text-xl font-serif font-bold text-brand-blue text-center uppercase">{tool.title || 'Sem Título'}</h4>
                        </div>
                        <div className="p-6 flex-grow"><p className="text-sm text-slate-600 leading-relaxed">{tool.description || 'Sem descrição.'}</p></div>
                        <div className="p-4 bg-white border-t border-slate-200 rounded-b-lg flex space-x-3">
                          {tool.isGenerated ? (
                            <button onClick={() => generatePDF()} className="flex-1 bg-brand-blue text-white text-sm font-bold py-2 px-4 rounded hover:bg-slate-800 transition flex items-center justify-center"><Download className="h-4 w-4 mr-2" /> Baixar PDF</button>
                          ) : (
                            <a href={tool.fileUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex-1 bg-brand-blue text-white text-sm font-bold py-2 px-4 rounded hover:bg-slate-800 transition flex items-center justify-center"><Download className="h-4 w-4 mr-2" /> Acessar PDF</a>
                          )}
                          <button onClick={() => handleCopyLink(tool.fileUrl || '#')} className="flex-1 border border-brand-blue text-brand-blue text-sm font-bold py-2 px-4 rounded hover:bg-slate-50 transition flex items-center justify-center">
                            {copiedLink ? <>Copiado!</> : <><LinkIcon className="h-4 w-4 mr-2" /> Copiar Link</>}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'METRICS' && (
            <div className="animate-fadeIn w-full">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-slate-100 border-t-4 border-brand-blue">
                <h3 className="text-lg font-semibold mb-4 text-brand-blue border-b pb-2 flex items-center"><BarChart className="h-5 w-5 mr-2 text-brand-gold" /> Adicionar Métrica</h3>
                <form onSubmit={handleAddMetric} className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  <input placeholder="Rótulo" className="border p-2 rounded w-full" value={newMetric.label} onChange={e => setNewMetric({ ...newMetric, label: e.target.value })} required />
                  <input placeholder="Valor" className="border p-2 rounded w-full" value={newMetric.value} onChange={e => setNewMetric({ ...newMetric, value: e.target.value })} required />
                  <button type="submit" className="bg-brand-gold text-white font-bold py-2 rounded w-full">Adicionar</button>
                </form>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {metrics.map(metric => {
                  if (!metric || !metric.id) return null;
                  return (
                    <div key={metric.id} className="bg-white p-6 rounded shadow-sm flex justify-between items-center border border-slate-100">
                      <div><span className="text-3xl font-bold text-brand-blue block">{metric.value || '0'}</span><span className="text-sm text-slate-500 uppercase">{metric.label || 'Métrica'}</span></div>
                      <button onClick={() => removeMetric(metric.id)} className="text-red-400 hover:text-red-600"><Trash2 className="h-5 w-5" /></button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'SEO' && (
            <div className="animate-fadeIn w-full">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 border-t-4 border-brand-blue">
                <h3 className="text-lg font-semibold mb-6 text-brand-blue border-b pb-2">Editar Meta Tags</h3>
                <form onSubmit={handleUpdateSEO} className="space-y-4 w-full">
                  <div><label className="block text-xs font-bold text-slate-500 uppercase">Title</label><input className="w-full border p-2 rounded" value={seoForm.title} onChange={e => setSeoForm({ ...seoForm, title: e.target.value })} /></div>
                  <div><label className="block text-xs font-bold text-slate-500 uppercase">Description</label><textarea className="w-full border p-2 rounded" value={seoForm.description} onChange={e => setSeoForm({ ...seoForm, description: e.target.value })} /></div>
                  <button type="submit" className="w-full bg-brand-gold text-white font-bold py-3 rounded">Salvar SEO</button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'SETTINGS' && (
            <div className="max-w-4xl mx-auto animate-fadeIn w-full space-y-8">
              {/* Auth Settings */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100 border-t-4 border-brand-blue">
                <h3 className="text-lg font-semibold mb-6 text-brand-blue flex items-center"><Lock className="h-5 w-5 mr-2 text-brand-gold" /> Alterar Senha Geral</h3>
                <form onSubmit={handlePasswordChange} className="space-y-6 w-full">
                  <input type="password" className="w-full border p-3 rounded" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nova senha" />
                  <button type="submit" className="w-full bg-brand-blue text-white px-4 py-3 rounded font-bold">Atualizar Senha</button>
                </form>
              </div>

              {/* Internal Notification Emails */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100 border-t-4 border-brand-gold">
                <h3 className="text-lg font-semibold mb-6 text-brand-blue flex items-center"><Mail className="h-5 w-5 mr-2 text-brand-gold" /> Destinatários de Notificação (NOTIFY_EMAILS)</h3>
                <p className="text-xs text-slate-500 mb-6 uppercase font-bold">Estes e-mails receberão alertas automáticos para cada nova mensagem recebida no site.</p>
                <div className="space-y-4">
                  {localInternalEmails.map((email, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={e => {
                          const newList = [...localInternalEmails];
                          newList[idx] = e.target.value;
                          setLocalInternalEmails(newList);
                          debouncedSaveEmails(newList);
                        }}
                        className="flex-grow border p-2 rounded focus:outline-none focus:border-brand-blue text-sm"
                        placeholder="exemplo@email.com"
                      />
                      <button
                        onClick={() => {
                          if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
                          const newList = localInternalEmails.filter((_, i) => i !== idx);
                          setLocalInternalEmails(newList);
                          setIsEditingEmails(false);
                          updateInternalEmails(newList);
                        }}
                        className="text-red-400 p-2 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newList = [...localInternalEmails, ''];
                      setLocalInternalEmails(newList);
                    }}
                    className="text-xs font-bold text-brand-blue hover:text-brand-gold flex items-center p-2 bg-slate-50 rounded border border-slate-200"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Adicionar E-mail
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      </div>
    </div >
  );
};

export default Admin;
