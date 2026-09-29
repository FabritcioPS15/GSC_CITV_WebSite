import SedesMap from '../components/SedesMap';
import RevealOnScroll from '../components/RevealOnScroll';
import ConveniosCarousel from '../components/ConveniosCarousel';
import HeroCarousel from '../components/HeroCarousel';
import { ShieldCheck, Award, Zap, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PremiumButton from '../components/PremiumButton';

function Inicio() {
  return (
    <div className="bg-[#f8fafc]">
      <Helmet>
        <title>Inicio | Revisiones Técnicas Vehiculares - Inspección Técnica Certificada</title>
        <meta name="description" content="Centro de revisiones técnicas vehiculares certificado por el MTC. Realizamos inspección técnica de vehículos con tecnología de punta. Encuentra nuestras sedes y requisitos." />
        <meta name="keywords" content="revisiones tecnicas, revision tecnica vehicular, inspeccion tecnica, inspeccion tecnica vehicular, revision vehicular, MTC, certificacion vehicular" />
        <link rel="canonical" href="https://tu-dominio.com/" />
      </Helmet>
      {/* Hero Carousel */}
      <RevealOnScroll>
        <HeroCarousel />
      </RevealOnScroll>

      {/* Thin Banner: Autorizados por el MTC */}
      <div className="w-full bg-orange-500 py-3 relative z-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 text-white font-bold tracking-widest uppercase text-xs sm:text-sm">
            <ShieldCheck size={20} />
            Autorizados y Certificados por el MTC
          </div>
          <div className="flex items-center gap-6 opacity-90">
             <span className="text-white font-medium text-xs hidden md:block">Tecnología de Punta</span>
             <span className="text-white font-medium text-xs hidden md:block">Personal Cualificado</span>
             <span className="text-white font-medium text-xs hidden md:block">Atención Rápida</span>
          </div>
        </div>
      </div>

      {/* Acerca de Nosotros Section */}
      <RevealOnScroll>
        <section className="max-w-7xl mx-auto px-4 section">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16 items-center">
            <div className="space-y-6">
              <h4 className="text-orange-500 font-bold uppercase tracking-widest text-sm">Sobre Nosotros</h4>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                Líderes en Revisiones <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                  Técnicas Vehiculares
                </span>
              </h2>
              <div className="w-20 h-1 bg-orange-500 animate-grow-horizontal"></div>
              <p className="content-text text-gray-600 pt-4 max-w-lg">
                El <strong className="text-gray-900">Grupo San Cristóbal</strong> es una corporación dedicada a garantizar la seguridad vial a nivel nacional, brindando un servicio de inspección técnica vehicular de la más alta calidad y precisión.
              </p>
              <p className="content-text text-gray-600 max-w-lg">
                Contamos con tecnología europea de última generación y un equipo de profesionales en constante capacitación, lo que nos permite ofrecer resultados confiables, rápidos y transparentes.
              </p>
              
               <div className="pt-6">
                  <PremiumButton to="/nosotros" plain className="bg-black text-white hover:bg-orange-500 gap-2 group">
                      Conoce nuestra historia
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </PremiumButton>
               </div>
            </div>

            <div className="relative">
                <div className="aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl relative">
                    <img
                      src="https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                      alt="Técnico inspeccionando un vehículo"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    <div className="absolute bottom-8 left-8 right-8">
                        <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl flex items-center justify-around border border-white/40">
                            <div className="text-center">
                                <p className="stat-num text-3xl font-black text-orange-500">10+</p>
                                <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wider mt-1">Años de Exp.</p>
                            </div>
                            <div className="w-[1px] h-12 bg-gray-200"></div>
                            <div className="text-center">
                                <p className="stat-num text-3xl font-black text-orange-500">15</p>
                                <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wider mt-1">Plantas</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-orange-100 rounded-full blur-3xl -z-10"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-100 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* Por qué elegirnos Section (Dark Minimalist) */}
      <RevealOnScroll>
        <section className="bg-[#0a0a0a] section relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-500/5 skew-x-12 transform translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-orange-500/5 -skew-x-12 transform -translate-x-1/2"></div>

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
                <h4 className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4">La seguridad es primero</h4>
                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">¿Por qué elegir <span className="text-orange-500">GSC?</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: ShieldCheck, title: "Tecnología MTC", desc: "Equipos certificados y conectados directamente con el MTC para máxima transparencia." },
                  { icon: Clock, title: "Atención Ágil", desc: "Procesos optimizados y líneas exclusivas para reducir su tiempo de espera al mínimo." },
                  { icon: Award, title: "Personal Experto", desc: "Ingenieros y técnicos capacitados constantemente bajo normativas ISO." },
                  { icon: Zap, title: "Entrega Inmediata", desc: "Resultados y certificados entregados inmediatamente al finalizar la revisión." }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group">
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                      <item.icon size={28} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-3 text-xl">{item.title}</h4>
                      <p className="content-text text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* Servicios Principales */}
      <RevealOnScroll>
        <section className="max-w-7xl mx-auto px-4 section">
          <div className="">
              <h4 className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-3">Soluciones Integrales</h4>
              <div className="flex justify-between items-end gap-6 flex-wrap">
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none">Nuestros Servicios</h2>
                  <p className="text-gray-500 max-w-sm text-sm">Ofrecemos un catálogo completo de certificaciones técnicas para todo tipo de vehículos y flotas comerciales.</p>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Inspección Livianos", img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", desc: "Automóviles, Camionetas, SUV. Servicio ágil y preciso." },
              { title: "Transporte Pesado", img: "https://images.unsplash.com/photo-1506774518161-b710d10e2733?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", desc: "Camiones, buses y flotas logísticas. Líneas especializadas." },
              { title: "Motocicletas", img: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", desc: "Revisión técnica para vehículos menores, motos y mototaxis." }
            ].map((item, index) => (
              <div key={index} className="group cursor-pointer rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 flex flex-col">
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur w-10 h-10 rounded-full flex items-center justify-center text-orange-500 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <ChevronRight size={20} />
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-black text-gray-900 mb-3">{item.title}</h3>
                  <p className="content-text text-gray-500 mb-6 flex-grow">
                    {item.desc}
                  </p>
                  <div>
                      <span className="text-orange-500 font-bold text-sm tracking-wide uppercase flex items-center gap-1 group-hover:gap-2 transition-all">
                          Ver detalles <ChevronRight size={14} />
                      </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <ConveniosCarousel />
      </RevealOnScroll>

      <RevealOnScroll>
        <ConveniosCarousel />
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="max-w-7xl mx-auto px-4 section">
          <div className="text-center mb-12">
              <h4 className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-3">Red Nacional</h4>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Encuentra tu Sede más Cercana</h2>
          </div>
          <div className="shadow-2xl">
            <SedesMap />
          </div>
        </section>
      </RevealOnScroll>
    </div>
  );
}

export default Inicio;
