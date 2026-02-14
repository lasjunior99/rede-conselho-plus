
import React from 'react';
import { Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const LogoIcon = () => (
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-gold">
      <circle cx="50" cy="15" r="4" fill="currentColor" />
      <circle cx="85" cy="40" r="4" fill="currentColor" />
      <circle cx="72" cy="80" r="4" fill="currentColor" />
      <circle cx="28" cy="80" r="4" fill="currentColor" />
      <circle cx="15" cy="40" r="4" fill="currentColor" />
      <circle cx="50" cy="75" r="3.5" fill="currentColor" />
      <circle cx="25" cy="55" r="3.5" fill="currentColor" />
      <circle cx="35" cy="28" r="3.5" fill="currentColor" />
      <circle cx="65" cy="28" r="3.5" fill="currentColor" />
      <circle cx="75" cy="55" r="3.5" fill="currentColor" />
      <path d="M50 15 L85 40 L72 80 L28 80 L15 40 Z" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M35 28 L65 28 L75 55 L50 75 L25 55 Z" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="50" y1="15" x2="35" y2="28" stroke="currentColor" strokeWidth="2" />
      <line x1="50" y1="15" x2="65" y2="28" stroke="currentColor" strokeWidth="2" />
      <line x1="85" y1="40" x2="65" y2="28" stroke="currentColor" strokeWidth="2" />
      <line x1="85" y1="40" x2="75" y2="55" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="80" x2="75" y2="55" stroke="currentColor" strokeWidth="2" />
      <line x1="72" y1="80" x2="50" y2="75" stroke="currentColor" strokeWidth="2" />
      <line x1="28" y1="80" x2="50" y2="75" stroke="currentColor" strokeWidth="2" />
      <line x1="28" y1="80" x2="25" y2="55" stroke="currentColor" strokeWidth="2" />
      <line x1="15" y1="40" x2="25" y2="55" stroke="currentColor" strokeWidth="2" />
      <line x1="15" y1="40" x2="35" y2="28" stroke="currentColor" strokeWidth="2" />
    </svg>
  );

  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
               <LogoIcon />
               <span className="text-lg font-bold text-brand-blue tracking-widest font-serif">
                 REDE CONSELHO<span className="text-brand-gold">+</span>
               </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Uma rede que conecta pessoas, experiências e boas práticas de governança corporativa.
            </p>
          </div>
          <div>
            <h3 className="text-brand-blue font-semibold uppercase tracking-wider mb-4 text-sm">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-brand-gold transition">Home</Link></li>
              <li><Link to="/identidade" className="hover:text-brand-gold transition">A rede</Link></li>
              <li><Link to="/membros" className="hover:text-brand-gold transition">Quem é quem</Link></li>
              <li><Link to="/blog" className="hover:text-brand-gold transition uppercase">blog</Link></li>
              <li><Link to="/noticias" className="hover:text-brand-gold transition">Notícias</Link></li>
              <li><Link to="/contato" className="hover:text-brand-gold transition">Contato</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-brand-blue font-semibold uppercase tracking-wider mb-4 text-sm">Social</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/company/108599157/admin/notifications/all/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-brand-blue transition"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-brand-blue transition"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-100 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} REDE CONSELHO+. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
