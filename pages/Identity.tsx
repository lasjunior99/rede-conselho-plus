import React from 'react';
import { Target, Eye, Anchor, FileText } from 'lucide-react';

const Identity: React.FC = () => {
  return (
    <div className="bg-white w-full">
      <div className="bg-brand-gray py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif font-bold text-brand-blue mb-4">Identidade Organizacional</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Nossa essência reflete o compromisso inegociável com a ética e a perenidade das organizações.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-slate-50 p-8 rounded border-t-4 border-brand-blue shadow-sm">
            <Target className="h-8 w-8 text-brand-gold mb-4" />
            <h3 className="text-xl font-bold text-brand-blue mb-3">Missão</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Conectar e capacitar conselheiros e executivos para promover uma governança corporativa que gere valor sustentável.
            </p>
          </div>
          <div className="bg-slate-50 p-8 rounded border-t-4 border-brand-gold shadow-sm">
            <Eye className="h-8 w-8 text-brand-gold mb-4" />
            <h3 className="text-xl font-bold text-brand-blue mb-3">Visão</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Ser a referência nacional em rede de governança, reconhecida pela qualidade técnica e ética de seus membros.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="flex items-center mb-6">
              <Anchor className="h-6 w-6 text-brand-blue mr-3" />
              <h2 className="text-3xl font-serif font-bold text-brand-blue">Nossa História</h2>
            </div>
            <div className="prose prose-slate text-slate-600 text-justify">
              <p className="mb-4">
                A REDE CONSELHO+ nasceu da inquietação de um grupo de conselheiros independentes que percebeu a necessidade de um espaço seguro para troca de experiências profundas sobre os desafios da sala de conselho.
              </p>
              <p>
                O que começou com encontros informais em 2020, rapidamente estruturou-se como uma rede de fomento à boas práticas, atraindo profissionais de diversas áreas de especialização, unidos pelo propósito de elevar a barra da governança no Brasil.
              </p>
            </div>
          </div>
          <div className="bg-brand-blue text-white p-10 rounded-lg shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-brand-gold rounded-full opacity-20"></div>
             <div className="relative z-10">
               <div className="flex items-center mb-4">
                 <FileText className="h-6 w-6 text-brand-gold mr-3" />
                 <h2 className="text-2xl font-serif font-bold text-white">Manifesto da Rede</h2>
               </div>
               <p className="italic font-light text-slate-200 leading-relaxed">
                 "Acreditamos que a governança não é burocracia, é a alma da organização. Não somos apenas fiscais de regras, somos arquitetos de futuros sustentáveis. Na complexidade do mundo atual, ninguém governa sozinho. Nossa força está no 'nós', na soma de visões, na coragem de fazer as perguntas difíceis e na sabedoria de construir respostas éticas."
               </p>
             </div>
          </div>
        </div>

        <div className="mb-20 rounded-xl overflow-hidden shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
            alt="Reunião executiva colaborativa com diversidade" 
            className="w-full h-[400px] object-cover"
          />
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-serif font-bold text-brand-blue text-center mb-10">Valores e Princípios Orientadores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start">
               <div className="bg-brand-gold/20 p-2 rounded mr-4 mt-1"><span className="font-bold text-brand-blue">01</span></div>
               <div><h4 className="font-bold text-brand-blue text-lg">Visão Sistêmica</h4><p className="text-sm text-slate-600">Enxergar o todo, compreender as interdependências e tomar decisões que equilibram estratégia, governança e resultado no longo prazo.</p></div>
            </div>
            <div className="flex items-start">
               <div className="bg-brand-gold/20 p-2 rounded mr-4 mt-1"><span className="font-bold text-brand-blue">02</span></div>
               <div><h4 className="font-bold text-brand-blue text-lg">Ética e Integridade</h4><p className="text-sm text-slate-600">Agir com coerência entre discurso e prática, colocando a transparência e a responsabilidade acima de qualquer interesse circunstancial.</p></div>
            </div>
             <div className="flex items-start">
               <div className="bg-brand-gold/20 p-2 rounded mr-4 mt-1"><span className="font-bold text-brand-blue">03</span></div>
               <div><h4 className="font-bold text-brand-blue text-lg">Colaboração</h4><p className="text-sm text-slate-600">Construir soluções melhores por meio da inteligência coletiva, onde a soma das competências gera valor superior ao esforço individual.</p></div>
            </div>
             <div className="flex items-start">
               <div className="bg-brand-gold/20 p-2 rounded mr-4 mt-1"><span className="font-bold text-brand-blue">04</span></div>
               <div><h4 className="font-bold text-brand-blue text-lg">Inovação</h4><p className="text-sm text-slate-600">Desafiar o status quo com criatividade disciplinada, transformando ideias em soluções concretas que geram vantagem competitiva.</p></div>
            </div>
            <div className="flex items-start">
               <div className="bg-brand-gold/20 p-2 rounded mr-4 mt-1"><span className="font-bold text-brand-blue">05</span></div>
               <div><h4 className="font-bold text-brand-blue text-lg">Excelência Técnica</h4><p className="text-sm text-slate-600">Aplicar conhecimento aprofundado, metodologia rigorosa e atualização contínua para entregar resultados consistentes e confiáveis.</p></div>
            </div>
            <div className="flex items-start">
               <div className="bg-brand-gold/20 p-2 rounded mr-4 mt-1"><span className="font-bold text-brand-blue">06</span></div>
               <div><h4 className="font-bold text-brand-blue text-lg">Respeito</h4><p className="text-sm text-slate-600">Reconhecer a dignidade, a experiência e a contribuição de cada pessoa como base para relações sólidas e produtivas.</p></div>
            </div>
            <div className="flex items-start">
               <div className="bg-brand-gold/20 p-2 rounded mr-4 mt-1"><span className="font-bold text-brand-blue">07</span></div>
               <div><h4 className="font-bold text-brand-blue text-lg">Diversidade e Inclusão</h4><p className="text-sm text-slate-600">Valorizar perspectivas plurais e garantir espaço de participação efetiva, fortalecendo decisões mais ricas e sustentáveis.</p></div>
            </div>
            <div className="flex items-start">
               <div className="bg-brand-gold/20 p-2 rounded mr-4 mt-1"><span className="font-bold text-brand-blue">08</span></div>
               <div><h4 className="font-bold text-brand-blue text-lg">Impacto Sustentável</h4><p className="text-sm text-slate-600">Gerar resultados econômicos, sociais e institucionais que permanecem relevantes e responsáveis ao longo do tempo.</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Identity;