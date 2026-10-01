import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import RevealOnScroll from '../components/RevealOnScroll';
import SedesMap from '../components/SedesMap';
import { branches } from '../../backend/data/branches';
import { MapPin, Phone, Clock, ArrowRight, ShieldCheck, Navigation, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import PremiumButton from '../components/PremiumButton';
import { Helmet } from 'react-helmet-async';
import { getConsent } from '../utils/consent';

function Sedes() {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [nearestBranchId, setNearestBranchId] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para el carrusel de beneficios (solo en móvil)
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      if (el.scrollWidth <= el.clientWidth) return; // no hay overflow (desktop)
      const cardWidth = el.querySelector('.shrink-0')?.clientWidth ?? 0;
      const gap = 24; // gap-6 = 24px
      const step = cardWidth + gap;
      const nextScroll = el.scrollLeft + step;
      if (nextScroll >= el.scrollWidth - el.clientWidth - 1) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollTo({ left: nextScroll, behavior: 'smooth' });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const limaBranches = branches.filter((b) => b.region === 'lima');
  const provinciaBranches = branches.filter((b) => b.region === 'provincia');

  // Helper function: Haversine distance formula
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const findNearest = () => {
    if (!navigator.geolocation) {
      setLocationError("Tu navegador no soporta geolocalización.");
      return;
    }

    if (!getConsent().location) {
      window.dispatchEvent(new Event('open-cookie-settings'));
      return;
    }

    setLocationError(null);
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        let minDistance = Infinity;
        let closestId: number | null = null;

        branches.forEach(branch => {
          const dist = getDistance(latitude, longitude, branch.position[0], branch.position[1]);
          if (dist < minDistance) {
            minDistance = dist;
            closestId = branch.id;
          }
        });

        if (closestId) {
          setNearestBranchId(closestId);
          setLoadingLocation(false);
          // Lleva la vista a la tarjeta. Antes esto se quitó porque se disparaba
          // solo al cargar la página y saltaba sin que el usuario pidiera nada.
          // Ahora findNearest() solo corre al pulsar el botón, así que el scroll
          // es la respuesta a esa acción y sin él no hay feedback visible: la
          // tarjeta puede quedar muy por debajo del pliegue.
          requestAnimationFrame(() => {
            const element = document.getElementById(`branch-${closestId}`);
            if (element) {
              const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              element.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
            }
          });
        }
      },
      (error) => {
        console.warn("Geolocation on Sedes failed:", error.message);
        setLoadingLocation(false);
        setLocationError('No pudimos obtener tu ubicación. Revisa los permisos del navegador e inténtalo de nuevo.');
      }
    );
  };

  return (
    <div className="bg-white">
      <Helmet>
        <title>Sedes | Centros de Revisión Técnica Vehicular - Encuentra la Más Cercana</title>
        <meta name="description" content="Encuentra nuestras sedes de revisión técnica vehicular. Centros en Lima y provincias certificados por el MTC. Ubicación, horarios y servicios de inspección técnica." />
        <meta name="keywords" content="sedes, centros de revision tecnica, revision tecnica cerca de mi, revision vehicular lima, inspeccion tecnica sedes, MTC" />
        <link rel="canonical" href="https://tu-dominio.com/sedes" />
      </Helmet>
      {/* Standardized Left-Aligned Banner (Compact) */}
      <section className="page-banner">
        {/* Background Layer with uniform overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Nuestras Sedes"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        </div>

        {/* Content Layer Aligned Left */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <RevealOnScroll>
            <div className="max-w-3xl flex items-center gap-6 group">
              <div className="w-1.5 h-20 bg-orange-500 rounded-full shrink-0 animate-grow-vertical" />
              <div className="space-y-4">
                <h1 className="banner-title text-white animate-grow-text">
                  Nuestras <span className="text-orange-500">Sedes</span>
                </h1>
                <p className="banner-description text-gray-500">
                  Encuentra la planta de revisión técnica vehicular más cercana.
                  Garantizamos una inspección rápida, profesional y certificada en todo el Perú.
                </p>

                {/* Action Buttons. Ambos usan las mismas medidas (h-11 px-5) para
                    que se vean como un par y no como un boton grande al lado de
                    un link chico. */}
                <div className="flex flex-wrap gap-3 pt-2 items-center">
                  <PremiumButton
                    onClick={findNearest}
                    disabled={loadingLocation}
                    className="!px-5 !py-2.5 !h-11 text-sm gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30"
                  >
                    {loadingLocation ? (
                      <Loader2 className="animate-spin" size={17} />
                    ) : (
                      <Navigation size={17} className="group-hover:rotate-12 transition-transform" />
                    )}
                    {loadingLocation ? "Buscando..." : "Sede más cercana a mí"}
                  </PremiumButton>

                  <a
                    href="#mapa"
                    className="inline-flex items-center justify-center gap-2 !h-11 !px-5 rounded-full bg-white/10 hover:bg-orange-500 text-white text-sm font-bold transition-colors"
                  >
                    <Search size={17} />
                    Ver en el mapa
                  </a>
                </div>

                {locationError && (
                  <p role="alert" className="text-sm text-red-400 font-semibold mt-1">
                    {locationError}
                  </p>
                )}

                {nearestBranchId && !locationError && (
                  <p className="text-sm text-gray-400 mt-1">
                    Tu sede más cercana es{" "}
                    <span className="text-orange-500 font-bold">
                      {branches.find((b) => b.id === nearestBranchId)?.name}
                    </span>
                    . Está marcada más abajo en la lista.
                  </p>
                )}
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* Bottom Decorative Detail */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-orange-500/0 to-transparent opacity-50" />
      </section>

      {/* Hero Info Section */}
      <section className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 relative">
          {/* Carrusel en móvil, grid en tablet+ */}
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 px-[calc(50vw-1.5rem)] md:px-0 md:flex-row md:overflow-visible md:snap-none md:pb-0 md:grid md:grid-cols-3 md:gap-8 scrollbar-hide"
          >
            <div className="shrink-0 snap-center w-full md:w-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="text-orange-500" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Certificación MTC</h3>
              <p className="content-text text-gray-600">Todas nuestras sedes cuentan con la autorización oficial del Ministerio de Transportes y Comunicaciones.</p>
            </div>
            <div className="shrink-0 snap-center w-full md:w-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="text-orange-500" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Cobertura Nacional</h3>
              <p className="content-text text-gray-600">Estamos presentes en puntos estratégicos de Lima y las principales provincias del Perú.</p>
            </div>
            <div className="shrink-0 snap-center w-full md:w-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6">
                <Clock className="text-orange-500" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Atención Preferencial</h3>
              <p className="content-text text-gray-600">Horarios extendidos y procesos optimizados para que tu revisión técnica sea lo más rápida posible.</p>
            </div>
          </div>

          {/* Flechas de navegación (solo móvil) */}
          <div className="absolute inset-y-0 left-0 right-0 md:hidden pointer-events-none">
            <button
              type="button"
              onClick={() => carouselRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full bg-white/90 shadow-lg text-gray-700 hover:bg-white hover:shadow-xl transition-all"
              aria-label="Beneficio anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => carouselRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full bg-white/90 shadow-lg text-gray-700 hover:bg-white hover:shadow-xl transition-all"
              aria-label="Siguiente beneficio"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Listado de sedes */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-4">

          {/* LIMA */}
          {limaBranches.length > 0 && (
            <div className="">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Sedes en Lima</h2>
                  <div className="h-1 w-20 bg-orange-500 rounded-full" />
                </div>
                <p className="text-gray-500 font-medium">Contamos con {limaBranches.length} sedes autorizadas en la capital</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {limaBranches.map((branch) => {
                  const isNearest = branch.id === nearestBranchId;
                  return (
                    <RevealOnScroll key={branch.id}>
                      <div
                        id={`branch-${branch.id}`}
                        className={`group bg-white rounded-3xl border transition-all duration-500 overflow-hidden flex flex-col h-full ${isNearest
                          ? 'border-orange-500 shadow-2xl shadow-orange-500/20 scale-[1.02] ring-4 ring-orange-500/10'
                          : 'border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1'
                          }`}
                      >
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={branch.image || 'https://images.unsplash.com/photo-1580273916550-e323be2eb5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80'}
                            alt={branch.name}
                            className={`w-full h-full object-cover transition-transform duration-500 ${isNearest ? 'scale-105' : 'group-hover:scale-110'}`}
                          />
                          <div className="absolute top-4 left-4 flex gap-2">
                            <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/20">
                              {branch.type}
                            </span>
                            {isNearest && (
                              <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                                Más Cercana
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-8 flex flex-col flex-1">
                          <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-orange-500 transition-colors">{branch.name}</h3>

                          <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-3">
                              <MapPin className="text-orange-500 shrink-0 mt-0.5" size={18} />
                              <p className="content-text text-gray-600">{branch.address}</p>
                            </div>
                            {branch.phone && (
                              <div className="flex items-center gap-3">
                                <Phone className="text-orange-500 shrink-0" size={18} />
                                <p className="content-text text-gray-600">{branch.phone}</p>
                              </div>
                            )}
                          </div>

                          <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                            <Link
                              to={`/sedes/${branch.id}`}
                              className="text-sm font-bold text-gray-900 flex items-center gap-2 group/btn"
                            >
                              Ver Detalles
                              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform text-orange-500" />
                            </Link>
                            {branch.googleMapsUrl && (
                              <a
                                href={branch.googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-orange-500 hover:text-white transition-all duration-300"
                                title="Ver en Google Maps"
                              >
                                <MapPin size={20} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </RevealOnScroll>
                  );
                })}
              </div>
            </div>
          )}

          {/* PROVINCIAS */}
          {provinciaBranches.length > 0 && (
            <div>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Sedes en Provincias</h2>
                  <div className="h-1 w-20 bg-orange-500 rounded-full" />
                </div>
                <p className="text-gray-500 font-medium">Presencia estratégica en las principales ciudades</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {provinciaBranches.map((branch) => {
                  const isNearest = branch.id === nearestBranchId;
                  return (
                    <RevealOnScroll key={branch.id}>
                      <div
                        id={`branch-${branch.id}`}
                        className={`group bg-white rounded-3xl border transition-all duration-500 overflow-hidden flex flex-col h-full ${isNearest
                          ? 'border-orange-500 shadow-2xl shadow-orange-500/20 scale-[1.02] ring-4 ring-orange-500/10'
                          : 'border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1'
                          }`}
                      >
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={branch.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80'}
                            alt={branch.name}
                            className={`w-full h-full object-cover transition-transform duration-500 ${isNearest ? 'scale-105' : 'group-hover:scale-110'}`}
                          />
                          <div className="absolute top-4 left-4 flex gap-2">
                            <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/20">
                              {branch.type}
                            </span>
                            {isNearest && (
                              <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                                Más Cercana
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-8 flex flex-col flex-1">
                          <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-orange-500 transition-colors">{branch.name}</h3>

                          <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-3">
                              <MapPin className="text-orange-500 shrink-0 mt-0.5" size={18} />
                              <p className="content-text text-gray-600">{branch.address}</p>
                            </div>
                            {branch.phone && (
                              <div className="flex items-center gap-3">
                                <Phone className="text-orange-500 shrink-0" size={18} />
                                <p className="content-text text-gray-600">{branch.phone}</p>
                              </div>
                            )}
                          </div>

                          <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                            <Link
                              to={`/sedes/${branch.id}`}
                              className="text-sm font-bold text-gray-900 flex items-center gap-2 group/btn"
                            >
                              Ver Detalles
                              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform text-orange-500" />
                            </Link>
                            {branch.googleMapsUrl && (
                              <a
                                href={branch.googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-orange-500 hover:text-white transition-all duration-300"
                                title="Ver en Google Maps"
                              >
                                <MapPin size={20} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </RevealOnScroll>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Mapa Interactivo */}
      <section id="mapa" className="section bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <RevealOnScroll>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Mapa Interactivo de <span className="text-orange-500">Cobertura</span></h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Ubica nuestra red nacional de plantas de revisión técnica y elige la que más te convenga.</p>
            </RevealOnScroll>
          </div>

          <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-orange-500/5 pointer-events-none z-10" />
            <SedesMap />
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="section relative overflow-hidden bg-gray-50">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-500/5 skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">¿Dudas sobre tu inspección técnica?</h2>
            <p className="content-text text-gray-600 mb-10">
              Nuestro equipo de expertos está listo para asesorarte sobre requisitos, horarios y la normativa vigente del MTC para que tu trámite sea exitoso.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contacto"
                className="px-10 py-5 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/25 flex items-center gap-3 group"
              >
                Hablar con un asesor
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Sedes;


