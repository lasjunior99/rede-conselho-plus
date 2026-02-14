
import React, { useState } from 'react';
import { useData } from '../services/dataContext';
import { Linkedin, CheckCircle, ExternalLink } from 'lucide-react';

const Contact: React.FC = () => {
  const { addMessage } = useData();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    subject: 'Quero ser Membro',
    content: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.content) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    addMessage(formData);
    setSubmitted(true);
    setFormData({
      name: '',
      company: '',
      email: '',
      subject: 'Quero ser Membro',
      content: ''
    });
  };

  return (
    <div className="bg-slate-50 py-16 w-full relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-lg shadow-lg overflow-hidden w-full">
          <div className="bg-white p-10 flex flex-col justify-center border-r border-slate-100 w-full">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6 text-brand-blue">Fale Conosco</h2>
              <p className="text-slate-600 mb-10 font-light leading-relaxed">
                Deseja fazer parte da REDE CONSELHO+ ou tem dúvidas sobre nossos encontros? Preencha o formulário ou entre em contato.
              </p>

              {/* LinkedIn Alternative Block */}
              <div className="mt-8 pt-8 border-t border-slate-100">
                <p className="text-sm font-semibold text-slate-700 mb-4">Prefere falar conosco pelo LinkedIn?</p>
                <a 
                  href="https://www.linkedin.com/company/108599157/admin/notifications/all/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-[#0077b5] text-white px-6 py-3 rounded-sm font-bold hover:bg-[#005582] transition shadow-md group"
                >
                  <Linkedin className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Acessar LinkedIn
                  <ExternalLink className="h-4 w-4 ml-2 opacity-50" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="p-10 w-full">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-fadeIn">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Mensagem Enviada!</h3>
                <p className="text-slate-600">Recebemos sua mensagem e enviamos uma confirmação para seu e-mail. Em breve entraremos em contato.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-brand-gold font-bold hover:underline"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Envie sua mensagem</h3>
                <form className="space-y-6 w-full" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                    <div className="w-full">
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Nome*</label>
                      <input 
                        type="text" 
                        required
                        className="w-full border-b border-slate-300 py-2 focus:outline-none focus:border-brand-gold transition-colors bg-transparent" 
                        placeholder="Seu nome completo" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="w-full">
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Empresa</label>
                      <input 
                        type="text" 
                        className="w-full border-b border-slate-300 py-2 focus:outline-none focus:border-brand-gold transition-colors bg-transparent" 
                        placeholder="Sua organização" 
                        value={formData.company}
                        onChange={e => setFormData({...formData, company: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">E-mail*</label>
                    <input 
                      type="email" 
                      required
                      className="w-full border-b border-slate-300 py-2 focus:outline-none focus:border-brand-gold transition-colors bg-transparent" 
                      placeholder="nome@empresa.com" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Assunto</label>
                    <select 
                      className="w-full border-b border-slate-300 py-2 focus:outline-none focus:border-brand-gold bg-transparent text-slate-700"
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                    >
                      <option value="Quero ser Membro">Quero ser Membro</option>
                      <option value="Dúvidas Gerais">Dúvidas Gerais</option>
                      <option value="Eventos">Eventos</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                  <div className="w-full">
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Mensagem*</label>
                    <textarea 
                      required
                      className="w-full border-b border-slate-300 py-2 focus:outline-none focus:border-brand-gold transition-colors h-32 resize-none bg-transparent" 
                      placeholder="Escreva sua mensagem aqui..."
                      value={formData.content}
                      onChange={e => setFormData({...formData, content: e.target.value})}
                    ></textarea>
                  </div>
                  <button type="submit" className="bg-brand-gold text-brand-blue font-bold px-8 py-3 rounded hover:bg-yellow-500 transition w-full sm:w-auto">Enviar Mensagem</button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
