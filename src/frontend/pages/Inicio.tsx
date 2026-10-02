import { useState } from 'react';
import SedesMap from '../components/SedesMap';
import RevealOnScroll from '../components/RevealOnScroll';
import ConveniosCarousel from '../components/ConveniosCarousel';
import HeroCarousel from '../components/HeroCarousel';
import { ShieldCheck, Award, Zap, Clock, ChevronRight } from 'lucide-react';
import Seo from '../components/Seo';
import { schemaNegocio } from '../seo/schemas';
import ServicioModal from '../components/ServicioModal';
import PremiumButton from '../components/PremiumButton';
import { useCarrusel } from '../hooks/useCarrusel';

/** "Por qué elegir GSC". En movil se muestran de a una como carrusel. */
const VENTAJAS = [
  {
    icon: ShieldCheck,
    title: 'Tecnología MTC',
    desc: 'Equipos certificados y conectados directamente con el MTC para máxima transparencia.',
  },
  {
    icon: Clock,
    title: 'Atención Ágil',
    desc: 'Procesos optimizados y líneas exclusivas para reducir su tiempo de espera al mínimo.',
  },
  {
    icon: Award,
    title: 'Personal Experto',
    desc: 'Ingenieros y técnicos capacitados constantemente bajo normativas ISO.',
  },
  {
    icon: Zap,
    title: 'Entrega Inmediata',
    desc: 'Resultados y certificados entregados inmediatamente al finalizar la revisión.',
  },
];

/** Milisegundos entre cambio automático de card. */
const VENTAJAS_AUTOPLAY_MS = 10000;

/**
 * "Nuestros Servicios". También carrusel en móvil.
 *
 * `detalle` e `incluye` alimentan el popup de cada tarjeta: sin ellos la tarjeta
 * se veía clickeable pero no tenía nada que abrir.
 */
const SERVICIOS = [
  {
    title: 'Inspección Livianos',
    img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    desc: 'Automóviles, Camionetas, SUV. Servicio ágil y preciso.',
    detalle:
      'Revisión técnica vehicular para vehículos livianos, registrada en el sistema del MTC y con entrega del certificado oficial en el acto. El proceso se realiza con líneas calibradas y sin que tengas que salir del vehículo.',
    incluye: [
      'Inspección de luces y señalización',
      'Frenos, suspensión y dirección',
      'Medición de emisiones de gases',
      'Neumáticos y estado general',
      'Certificado oficial MTC'
    ]
  },
  {
    title: 'Transporte Pesado',
    img: 'https://images.unsplash.com/photo-1506774518161-b710d10e2733?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    desc: 'Camiones, buses y flotas logísticas. Líneas especializadas.',
    detalle:
      'Inspección para camiones, buses y unidades de carga. Contamos con plataforma para vehículos pesados y personal capacitado en la normativa vigente, con líneas pensadas para el flujo de flotas comerciales.',
    incluye: [
      'Frenos y suspensión reforzada',
      'Control de ejes y peso permitido',
      'Emisiones para motor diésel',
      'Verificación de elementos de seguridad',
      'Certificado oficial MTC'
    ]
  },
  {
    title: 'Motocicletas',
    img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    desc: 'Revisión técnica para vehículos menores, motos y mototaxis.',
    detalle:
      'Revisión técnica de motocicletas y vehículos menores según el calendario del MTC. Una línea agility para mototaxis y repartidores, con atención rápida y emisión del certificado en el acto.',
    incluye: [
      'Inspección de luces, claxon y señalización',
      'Frenos, suspensión y dirección',
      'Neumáticos y estado general',
      'Medición de emisiones cuando corresponde',
      'Certificado oficial MTC'
    ]
  },
];

function Inicio() {
  const ventajas = useCarrusel({ total: VENTAJAS.length, autoplayMs: VENTAJAS_AUTOPLAY_MS });
  const servicios = useCarrusel({ total: SERVICIOS.length, autoplayMs: VENTAJAS_AUTOPLAY_MS });
  const [servicioAbierto, setServicioAbierto] = useState<(typeof SERVICIOS)[number] | null>(null);

  return (
    <div className="bg-[#f8fafc]">
      <Seo
        path="/"
        title="Revisión Técnica Vehicular en el Perú | Grupo San Cristóbal"
        description="Revisión técnica vehicular autorizada por el MTC. Inspección técnica de autos, camionetas, camiones y buses con certificado oficial. Sedes en Lima y provincias. Consulta tu revisión técnica, placa o gas."
        schema={schemaNegocio}
      />
      {/* Hero Carousel */}
      <RevealOnScroll>
        <HeroCarousel />
      </RevealOnScroll>

      {/* Thin Banner: Autorizados por el MTC. La imagen mide 10:1, así que a
          ancho completo queda demasiado alta; se constrain y centra para que
          lea como una franja y no como una sección. */}
      <div className="w-full relative z-20 bg-white py-4">
        <img
          src="/bannermtc.png"
          alt="Autorizados y Certificados por el MTC"
          className="w-full max-w-4xl h-auto block mx-auto"
        />
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
        <section ref={ventajas.seccionRef} className="bg-[#0a0a0a] section relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-500/5 skew-x-12 transform translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-orange-500/5 -skew-x-12 transform -translate-x-1/2"></div>

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h4 className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4">La seguridad es primero</h4>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">¿Por qué elegir <span className="text-orange-500">GSC?</span></h2>
            </div>

            {/* En movil es un carrusel de a una: cada card ocupa el ancho completo
                y hace snap. A partir de md vuelve a ser la grilla de siempre, asi
                que el mismo marcado sirve para los dos casos. */}
            <div
              ref={ventajas.trackRef}
              onScroll={ventajas.alDesplazar}
              onPointerDown={ventajas.pausar}
              className="relative flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 overflow-x-auto md:overflow-visible snap-x md:snap-none scrollbar-hide"
            >
              {VENTAJAS.map((item) => (
                <div
                  key={item.title}
                  className="w-full shrink-0 snap-center md:w-auto md:shrink bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group"
                >
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

            {/* Puntos. Solo en movil, que es donde hay carrusel. */}
            <div className="mt-8 flex items-center justify-center gap-2 md:hidden">
              {VENTAJAS.map((item, i) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => ventajas.irA(i)}
                  aria-label={`Ver ${item.title}`}
                  aria-current={ventajas.index === i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    ventajas.index === i ? 'w-7 bg-orange-500' : 'w-2 bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      {/* Servicios Principales */}
      <RevealOnScroll>
        <section ref={servicios.seccionRef} className="max-w-7xl mx-auto px-4 section">
          <div className="">
            <h4 className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-3">Soluciones Integrales</h4>
            <div className="flex justify-between items-end gap-6 flex-wrap">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none">Nuestros Servicios</h2>
              <p className="text-gray-500 max-w-sm text-sm">Ofrecemos un catálogo completo de certificaciones técnicas para todo tipo de vehículos y flotas comerciales.</p>
            </div>
          </div>

          {/* Mismo criterio que las ventajas: carrusel de a una en móvil, grilla
              de tres en desktop. */}
          <div
            ref={servicios.trackRef}
            onScroll={servicios.alDesplazar}
            onPointerDown={servicios.pausar}
            className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto md:overflow-visible snap-x md:snap-none scrollbar-hide"
          >
            {SERVICIOS.map((item) => (
              <div
                key={item.title}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`Ver detalles de ${item.title}`}
                onClick={() => setServicioAbierto(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setServicioAbierto(item);
                  }
                }}
                className="w-full shrink-0 snap-center md:w-auto md:shrink group cursor-pointer rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 transition-all duration-500 flex flex-col"
              >
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

          <div className="mt-8 flex items-center justify-center gap-2 md:hidden">
            {SERVICIOS.map((item, i) => (
              <button
                key={item.title}
                type="button"
                onClick={() => servicios.irA(i)}
                aria-label={`Ver ${item.title}`}
                aria-current={servicios.index === i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  servicios.index === i ? 'w-7 bg-orange-500' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </section>
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

      {/* Popup de detalle del servicio. Va al final del árbol para no quedar
          dentro de los RevealOnScroll, que transforman el contenedor y romperían
          un portal posicionado. */}
      {servicioAbierto && (
        <ServicioModal
          titulo={servicioAbierto.title}
          imagen={servicioAbierto.img}
          detalle={servicioAbierto.detalle}
          incluye={servicioAbierto.incluye}
          onClose={() => setServicioAbierto(null)}
        />
      )}
    </div>
  );
}

export default Inicio;
