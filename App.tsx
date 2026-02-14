import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { DataProvider, useData } from './services/dataContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Identity from './pages/Identity';
import Directory from './pages/Directory';
import Blog from './pages/Blog';
import News from './pages/News';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import SEOManager from './components/SEOManager';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const RedirectToHome = () => {
  const location = useLocation();
  const navigate = React.useCallback(() => {
    // Se não estiver na home e a página foi recarregada (não há histórico anterior)
    if (location.pathname !== '/' && window.history.state?.idx === 0) {
      window.location.hash = '#/';
    }
  }, [location.pathname]);

  React.useEffect(() => {
    navigate();
  }, [navigate]);

  return null;
};

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mb-4"></div>
      <p className="text-slate-500 font-medium">Carregando Rede Conselho+...</p>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { loading } = useData();
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  if (loading) return <LoadingScreen />;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-slate-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/identidade" element={<Identity />} />
          <Route path="/membros" element={<Directory />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/noticias" element={<News />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <SEOManager />
      <Router>
        <ScrollToTop />
        <RedirectToHome />
        <AppContent />
      </Router>
    </DataProvider>
  );
};

export default App;
