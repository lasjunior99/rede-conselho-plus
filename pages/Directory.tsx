
import React, { useState } from 'react';
import { Linkedin, Search, Filter, FileText, ExternalLink, Instagram } from 'lucide-react';
import { useData } from '../services/dataContext';
import { CATEGORIES, Member } from '../types';

const Directory: React.FC = () => {
  const { members } = useData();
  const [filterCategory, setFilterCategory] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredMembers = members.filter(member => {
    if (!member) return false;

    // Defensive checks for properties
    const memberName = (member.name || '').toLowerCase();
    const memberRole = (member.role || '').toLowerCase();

    const spec = Array.isArray(member.specialization)
      ? member.specialization
      : (member.specialization ? [member.specialization as unknown as string] : []);

    const matchesCategory = filterCategory === 'Todos' || spec.includes(filterCategory);
    const matchesSearch = memberName.includes(searchTerm.toLowerCase()) ||
      memberRole.includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const formatExternalUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-brand-blue mb-4">Quem é Quem?</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Conheça os especialistas que formam a REDE CONSELHO+. Profissionais selecionados com vasta experiência em governança.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-12 flex flex-col md:flex-row gap-4 items-center justify-between w-full">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por nome ou cargo..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded focus:outline-none focus:border-brand-blue"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Filter className="text-brand-gold h-5 w-5 shrink-0" />
            <select
              className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="Todos">Todas as Áreas</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {filteredMembers.map((member: Member) => {
              if (!member || !member.id || !member.name) return null;

              const specList = Array.isArray(member.specialization)
                ? member.specialization
                : (member.specialization ? [member.specialization as unknown as string] : []);
              return (
                <div key={member.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition duration-300 border border-slate-100 flex flex-col h-full">
                  <div className="h-2 bg-brand-gold"></div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <img
                        src={member.photoUrl || "https://via.placeholder.com/80"}
                        alt={`Foto de perfil de ${member.name}`}
                        className="h-20 w-20 rounded-full object-cover border-2 border-slate-100"
                        loading="lazy"
                      />
                    </div>
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-brand-blue">{member.name}</h3>
                      <p className="text-sm font-semibold text-brand-gold uppercase tracking-wide">{member.role || 'Conselheiro'}</p>
                    </div>

                    {member.bio && member.bio.trim() !== "" && (
                      <div className="mb-6 flex-grow">
                        <p className="text-sm text-slate-600 whitespace-pre-wrap italic leading-relaxed">
                          "{member.bio}"
                        </p>
                      </div>
                    )}

                    <div className="mb-6 flex flex-wrap gap-1.5">
                      {specList.map((area, idx) => (
                        <span key={idx} className="bg-slate-100 text-[10px] font-bold text-slate-500 px-2 py-0.5 rounded border border-slate-200">{area}</span>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2 mb-6">
                      {member.linkedinUrl && member.linkedinUrl.trim() !== "" && (
                        <a
                          href={formatExternalUrl(member.linkedinUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-xs font-bold text-brand-blue bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded p-2 transition w-full justify-center group"
                        >
                          <Linkedin className="h-4 w-4 mr-2 text-blue-600 group-hover:scale-110 transition-transform" />
                          LinkedIn
                          <ExternalLink className="h-3 w-3 ml-2 opacity-30" />
                        </a>
                      )}

                      {member.profileUrl && member.profileUrl.trim() !== "" && (
                        <a
                          href={formatExternalUrl(member.profileUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-xs font-bold text-brand-blue bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded p-2 transition w-full justify-center group"
                        >
                          <Instagram className="h-4 w-4 mr-2 text-pink-600 group-hover:scale-110 transition-transform" />
                          Instagram
                          <ExternalLink className="h-3 w-3 ml-2 opacity-30" />
                        </a>
                      )}

                      {member.cvUrl && (
                        <button
                          onClick={() => {
                            if (!member.cvUrl) return;

                            if (member.cvUrl.startsWith('data:')) {
                              try {
                                const parts = member.cvUrl.split(',');
                                const base64 = parts[1];
                                const contentType = parts[0].split(':')[1].split(';')[0];

                                const binary = atob(base64);
                                const array = new Uint8Array(binary.length);
                                for (let i = 0; i < binary.length; i++) {
                                  array[i] = binary.charCodeAt(i);
                                }

                                const blob = new Blob([array], { type: contentType || 'application/pdf' });
                                const blobUrl = URL.createObjectURL(blob);
                                window.open(blobUrl, '_blank');
                              } catch (e) {
                                console.error('Erro ao converter Base64 para PDF:', e);
                                alert('Erro ao abrir o documento. O formato pode estar inválido.');
                              }
                            } else {
                              window.open(member.cvUrl, '_blank', 'noopener,noreferrer');
                            }
                          }}
                          className="flex items-center text-xs font-bold text-brand-blue bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/30 rounded p-2 transition w-full justify-center group"
                        >
                          <FileText className="h-4 w-4 mr-2 text-brand-gold group-hover:scale-110 transition-transform" />
                          Exibir Perfil (PDF)
                          <ExternalLink className="h-3 w-3 ml-2 opacity-30" />
                        </button>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 mt-auto flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold"></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500 w-full">Nenhum membro encontrado.</div>
        )}
      </div>
    </div>
  );
};

export default Directory;
