import React from 'react';
import { useData } from '../services/dataContext';
import { User, Calendar } from 'lucide-react';

const Blog: React.FC = () => {
  const { blogPosts } = useData();


  return (
    <div className="bg-slate-50 min-h-screen py-16 w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif font-bold text-brand-blue mb-4">Blog & Insights</h1>
          <p className="text-slate-600">
            Artigos técnicos, opiniões e tendências sobre o universo da governança corporativa.
          </p>
        </div>
        <div className="space-y-12 w-full">
          {blogPosts.map(post => {
            if (!post || !post.id || !post.title) return null;

            const postDate = post.date ? new Date(post.date) : new Date();
            const dateString = isNaN(postDate.getTime()) ? new Date().toLocaleDateString() : postDate.toLocaleDateString();
            // const postContent = post.content || ''; // Removed as per instruction

            // const isExpanded = expandedPostId === post.id; // Removed as per instruction

            const handleReadMore = () => {
              if (post.externalLink) {
                window.open(post.externalLink, '_blank', 'noopener,noreferrer');
              } else if (post.pdfUrl) {
                try {
                  const base64Data = post.pdfUrl.split(',')[1];
                  const byteCharacters = atob(base64Data);
                  const byteNumbers = new Array(byteCharacters.length);
                  for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                  }
                  const byteArray = new Uint8Array(byteNumbers);
                  const blob = new Blob([byteArray], { type: 'application/pdf' });
                  const blobUrl = URL.createObjectURL(blob);
                  window.open(blobUrl, '_blank');
                } catch (e) {
                  console.error("Error opening PDF:", e);
                  window.open(post.pdfUrl, '_blank', 'noopener,noreferrer');
                }
              }
            };

            const hasLink = post.externalLink || post.pdfUrl; // Added as per instruction

            return (
              <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition w-full">
                <img
                  src={post.imageUrl || "https://via.placeholder.com/800x400"}
                  alt={`Imagem de capa do artigo: ${post.title}`}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
                <div className="p-8">
                  <div className="flex items-center space-x-4 text-xs text-slate-400 mb-4 uppercase tracking-wider">
                    <div className="flex items-center"><Calendar className="h-3 w-3 mr-1" />{dateString}</div>
                    <div className="flex items-center"><User className="h-3 w-3 mr-1" />{post.author || 'Redação'}</div>
                  </div>
                  <h2 className="text-2xl font-bold text-brand-blue mb-4">{post.title}</h2>
                  {/* Removed conditional rendering for isExpanded as per instruction */}
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {post.excerpt || 'Clique no botão abaixo para ler o artigo completo.'}
                  </p>

                  {hasLink && ( // Added conditional rendering for button as per instruction
                    <button onClick={handleReadMore} className="text-brand-gold font-semibold hover:text-brand-blue transition">
                      {post.externalLink ? 'Ler na íntegra (Link Externo) →' : 'Ler artigo completo (PDF) →'}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
          {blogPosts.length === 0 && <p className="text-center text-slate-500 w-full">Ainda não há publicações.</p>}
        </div>
      </div>
    </div>
  );
};

export default Blog;