import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import RevealOnScroll from '../components/RevealOnScroll';
import SedesMap from '../components/SedesMap';
import { branches, branchSlug } from '../../backend/data/branches';
import { MapPin, Phone, Clock, ArrowRight, ShieldCheck, Navigation, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import PremiumButton from '../components/PremiumButton';
import Seo from '../components/Seo';
import { schemaSedes, schemaBreadcrumbs } from '../seo/schemas';
import { getConsent } from '../utils/consent';

const SEDE_BENEFITS = [
  {
    icon: ShieldCheck,
    title: 'Certificación MTC',
    desc: 'Todas nuestras sedes cuentan con la autorización oficial del Ministerio de Transportes y Comunicaciones.',
  },
  {
    icon: MapPin,
    title: 'Cobertura Nacional',
    desc: 'Estamos presentes en puntos estratégicos de Lima y las principales provincias del Perú.',
  },
  {
    icon: Clock,
    title: 'Atención Preferencial',
    desc: 'Horarios extendidos y procesos optimizados para que tu revisión técnica sea lo más rápida posible.',
  },
];

function Sedes() {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [nearestBranchId, setNearestBranchId] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [activeBenefit, setActiveBenefit] = useState(0);
  const [isBenefitHovered, setIsBenefitHovered] = useState(false);

  const nextBenefit = useCallback(() => {
    setActiveBenefit((prev) => (prev + 1) % SEDE_BENEFITS.length);
  }, []);

  const prevBenefit = useCallback(() => {
    setActiveBenefit((prev) => (prev - 1 + SEDE_BENEFITS.length) % SEDE_BENEFITS.length);
  }, []);

  // Auto-slide para el carrusel de beneficios (1 a 1 cada 7 segundos)
  useEffect(() => {
    if (isBenefitHovered) return;
    const interval = setInterval(() => {
      nextBenefit();
    }, 7000);
    return () => clearInterval(interval);
  }, [isBenefitHovered, nextBenefit]);

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
<Seo
            path="/sedes"
            title="Sedes de Revisión Técnica Vehicular en Lima y Provincias | RTP San Cristóbal"
            description="Encuentra el centro de revisión técnica vehicular más cercano. Sedes autorizadas por el MTC en Callao, Ica, Ayacucho, Andahuaylas y Huancavelica. Dirección, horarios y contacto por WhatsApp."
            schema={{ ...schemaSedes, ...schemaBreadcrumbs([{ name: 'Inicio', path: '/' }, { name: 'Sedes', path: '/sedes' }]) }}
        />
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

                {/* Action Buttons (ocultos en vista móvil) */}
                <div className="hidden sm:flex flex-wrap gap-3 pt-2 items-center">
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

      {/* Hero Info Section - Carrusel automático 7s (1 por 1) */}
      <section className="py-14 bg-gray-50 border-b border-gray-100 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4">
          <div
            className="relative"
            onMouseEnter={() => setIsBenefitHovered(true)}
            onMouseLeave={() => setIsBenefitHovered(false)}
          >
            {/* Slider container */}
            <div className="overflow-hidden rounded-3xl">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${activeBenefit * 100}%)` }}
              >
                {SEDE_BENEFITS.map((item, index) => (
                  <div key={index} className="w-full shrink-0 px-2 sm:px-6">
                    <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-5 text-orange-500 shadow-inner">
                        <item.icon size={32} />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="content-text text-gray-600 max-w-xl text-sm sm:text-base leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              type="button"
              onClick={prevBenefit}
              className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-md border border-gray-100 text-gray-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 cursor-pointer"
              aria-label="Beneficio anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={nextBenefit}
              className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-md border border-gray-100 text-gray-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300 cursor-pointer"
              aria-label="Siguiente beneficio"
            >
              <ChevronRight size={20} />
            </button>

            {/* Indicator Dots */}
            <div className="flex items-center justify-center gap-2.5 mt-6">
              {SEDE_BENEFITS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveBenefit(i)}
                  aria-label={`Ir a beneficio ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                    activeBenefit === i ? 'w-8 bg-orange-500' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
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
                              to={`/sedes/${branchSlug(branch)}`}
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
                              to={`/sedes/${branchSlug(branch)}`}
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


