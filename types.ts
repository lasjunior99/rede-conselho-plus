
export interface Member {
  id: string;
  name: string;
  role: string;
  bio: string; // Max 80 words
  specialization: string[]; // Agora suporta array de strings para múltiplas áreas
  photoUrl: string; // Base64 Data URI or URL
  cvUrl?: string; // Base64 Data URI for PDF
  linkedinUrl?: string;
  email?: string;
  phone?: string;
  profileUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  content: string;
  excerpt: string;
  imageUrl: string; // Base64 Data URI or URL
}

export interface NewsItem {
  id: string;
  title: string;
  source: string; // e.g., "Mercado", "IBGC", "Internacional"
  date: string;
  summary: string;
  link?: string;
}

export interface Tool {
  id: string;
  title: string;
  description: string;
  fileUrl: string; // URL to the PDF
  date: string;
  isGenerated?: boolean; // Flag to indicate if it uses the internal PDF generator
}

export interface MetaConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
}

export interface Metric {
  id: string;
  label: string;
  value: string;
}

export enum MessageStatus {
  NEW = 'Novo',
  RESPONDED = 'Respondido',
  ARCHIVED = 'Arquivado'
}

export interface Message {
  id: string;
  name: string;
  company: string;
  email: string;
  subject: string;
  content: string;
  status: MessageStatus;
  reply?: string;
  createdAt: string;
  respondedAt?: string;
  notifiedAt?: string;
  notifiedSenderAt?: string;
}

export enum Page {
  HOME = 'HOME',
  IDENTITY = 'IDENTITY',
  DIRECTORY = 'DIRECTORY',
  BLOG = 'BLOG',
  NEWS = 'NEWS',
  CONTACT = 'CONTACT',
  ADMIN = 'ADMIN'
}

export const CATEGORIES = [
  "Estratégia Corporativa",
  "Finanças Corporativas",
  "Contabilidade e Auditoria",
  "Governança Corporativa",
  "Gestão de Riscos",
  "Compliance e Integridade",
  "Mercado de Capitais e Investimentos",
  "Planejamento Orçamentário e Controle",
  "Transformação Digital",
  "Tecnologia da Informação e Cibersegurança",
  "Inovação",
  "Pessoas, Cultura e Sucessão",
  "ESG e Sustentabilidade",
  "Relações Institucionais e Regulação",
  "Comunicação Corporativa e Reputação",
  "Operações e Eficiência Organizacional",
  "Experiência do Cliente e Mercado",
  "Novos Negócios e Modelo de Gestão",
  "Gestão de Crises",
  "Empreendedorismo"
];
