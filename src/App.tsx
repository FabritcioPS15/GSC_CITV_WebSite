import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './frontend/components/Header';
import Footer from './frontend/components/Footer';
import SmoothScroll from './frontend/components/SmoothScroll';
import ScrollToTop from './frontend/components/ScrollToTop';
import FloatingWhatsApp from './frontend/components/FloatingWhatsApp';
import PageTransition from './frontend/components/PageTransition';
import CookieConsent from './frontend/components/CookieConsent';
import LocationPrompt from './frontend/components/LocationPrompt';

// Lazy load pages for better performance
const Inicio = lazy(() => import('./frontend/pages/Inicio'));
const Nosotros = lazy(() => import('./frontend/pages/Nosotros'));
const Sedes = lazy(() => import('./frontend/pages/Sedes'));
const SedeDetalle = lazy(() => import('./frontend/pages/SedeDetalle'));
const Requisitos = lazy(() => import('./frontend/pages/Requisitos'));
const Contacto = lazy(() => import('./frontend/pages/Contacto'));
const Cronograma = lazy(() => import('./frontend/pages/Cronograma'));
const PlacaConsultaPage = lazy(() => import('./frontend/pages/PlacaConsultaPage'));
const RevisionConsultaPage = lazy(() => import('./frontend/pages/RevisionConsultaPage'));
const GasConsultaPage = lazy(() => import('./frontend/pages/GasConsultaPage'));
const Cupon = lazy(() => import('./frontend/pages/Cupon'));
const NotFound = lazy(() => import('./frontend/pages/NotFound'));

function AppContent() {
  const location = useLocation();

  return (
    <>
      <SmoothScroll />
      <ScrollToTop />
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className={`flex-grow ${location.pathname === '/' ? '' : 'pt-[90px]'}`}>
          <PageTransition>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Cargando...</div>}>
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/sedes" element={<Sedes />} />
                <Route path="/sedes/:id" element={<SedeDetalle />} />
                <Route path="/requisitos" element={<Requisitos />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/cronograma" element={<Cronograma />} />
                <Route path="/consulta-placa" element={<PlacaConsultaPage />} />
                <Route path="/consulta-revision" element={<RevisionConsultaPage />} />
                <Route path="/consulta-gas" element={<GasConsultaPage />} />
                <Route path="/cupon" element={<Cupon />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </PageTransition>
        </main>
        <Footer />
      </div>
      <FloatingWhatsApp />
      <CookieConsent />
      <LocationPrompt />
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}

export default App;

