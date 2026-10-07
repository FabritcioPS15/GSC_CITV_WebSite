import { useState } from 'react';
import SedesMap from '../components/SedesMap';
import RevealOnScroll from '../components/RevealOnScroll';
import ConveniosCarousel from '../components/ConveniosCarousel';
import HeroCarousel from '../components/HeroCarousel';
import { ShieldCheck, BadgeDollarSign, Clock, HeartHandshake, ChevronRight } from 'lucide-react';
import Seo from '../components/Seo';
import { schemaNegocio, schemaFaq, schemaGrafo } from '../seo/schemas';
import ServicioModal from '../components/ServicioModal';
import PremiumButton from '../components/PremiumButton';
import { useCarrusel } from '../hooks/useCarrusel';

/**
 * FAQ de la home.
 *
 * Cubre las consultas que ya llegan desde Google Search Console (consulta por
 * placa, costo, descarga del certificado, duración) para que la home pueda
 * competir por esas respuestas con un resultado enriquecido.
 */
const FAQ_HOME = [
  {
    q: '¿Qué es la revisión técnica vehicular?',
    a: 'Es la inspección obligatoria que verifica el estado de tu vehículo antes de circular. En RTP San Cristóbal la realizan líneas autorizadas por el MTC: revisamos frenos, luces, suspensión, neumáticos y emisiones, y al aprobar recibes el certificado oficial en el acto.'
  },
  {
    q: '¿Cuánto demora y cuánto cuesta la revisión técnica?',
    a: 'La inspección de un vehículo liviano toma menos de 20 minutos. El costo varía según el tipo de vehículo (auto, camioneta, camión o bus); en la página de Sedes y en el Tarifico de cada sede encuentras la tarifa vigente de tu unidad, siempre con impuestos incluidos.'
  },
  {
    q: '¿Cómo consulto mi revisión técnica por placa?',
    a: 'Ingresa a la sección Consulta con tu número de placa en la página de consulta de placa: mostramos la fecha de tu última inspección, la vigencia del certificado y el estado ante el MTC. También puedes consultar con el código impreso en tu sticker.'
  },
  {
    q: '¿Dónde descargo el certificado de revisión técnica?',
    a: 'El certificado oficial se entrega en el acto al aprobar la inspección en cualquiera de nuestras sedes. Para verificar o descargar una copia usa la consulta por código con el número de tu certificado, o solicítalo en WhatsApp indicando tu placa y el número de documento.'
  },
  {
    q: '¿Necesito cita previa?',
    a: 'No. Atendemos por orden de llegada de lunes a viernes de 7:00 a. m. a 7:00 p. m. y sábado de 8:00 a. m. a 5:00 p. m. Si prefieres coordinar tu llegada, escríbenos por WhatsApp y te confirmamos el horario con menos espera.'
  },
  {
    q: '¿Qué pasa si mi vehículo no aprueba?',
    a: 'Si la inspección detecta una observación, te indicamos qué componente requiere corrección. Una vez reparado vuelves a la sede: en RTP San Cristóbal te acompañamos con el proceso para que apruebes sin contratiempos.'
  }
];

/** "Por qué elegir GSC". En movil se muestran de a una como carrusel. */
const VENTAJAS = [
  {
    icon: Clock,
    title: 'Rapidez',
    desc: 'Revisión técnica en 20 minutos, ágil y sin esperas innecesarias.',
  },
  {
    icon: BadgeDollarSign,
    title: 'Precios Justos',
    desc: 'Tarifas accesibles y transparentes para cada tipo de vehículo.',
  },
  {
    icon: HeartHandshake,
    title: 'Atención Personalizada',
    desc: 'Priorizamos la atención de cada cliente con un equipo humano y capacitado.',
  },
  {
    icon: ShieldCheck,
    title: 'Acreditados por el MTC',
    desc: 'Autorizados y certificados por el Ministerio de Transportes y Comunicaciones.',
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
    title: 'Autos Particulares',
    img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    desc: 'Automóviles, camionetas y SUV. Servicio ágil y preciso.',
    detalle:
      'Revisión técnica vehicular para autos particulares, registrada en el sistema del MTC y con entrega del certificado oficial en el acto. El proceso se realiza con líneas calibradas y sin que tengas que salir del vehículo.',
    incluye: [
      'Inspección de luces y señalización',
      'Frenos, suspensión y dirección',
      'Medición de emisiones de gases',
      'Neumáticos y estado general',
      'Certificado oficial MTC'
    ]
  },
  {
    title: 'Transporte de Personas',
    img: 'https://images.unsplash.com/photo-1741540421036-ec4646b7ad3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    desc: 'Buses, combis y unidades de transporte público y privado.',
    detalle:
      'Inspección para vehículos de transporte de personas: buses, microbuses, combis y unidades de transporte de pasajeros. Contamos con líneas especializadas, personal capacitado en la normativa vigente y flujo pensado para el recorrido de estas unidades.',
    incluye: [
      'Frenos, suspensión y dirección',
      'Sistema de luces y señalización',
      'Emisiones y estado del motor',
      'Verificación de elementos de seguridad y extintor',
      'Certificado oficial MTC'
    ]
  },
  {
    title: 'Transporte de Mercancías',
    img: 'https://images.unsplash.com/photo-1506774518161-b710d10e2733?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    desc: 'Camiones, cisternas y flotas logísticas. Líneas especializadas.',
    detalle:
      'Inspección para camiones, cisternas y unidades de carga. Contamos con plataforma para vehículos pesados y personal capacitado en la normativa vigente, con líneas pensadas para el flujo de flotas comerciales.',
    incluye: [
      'Frenos y suspensión reforzada',
      'Control de ejes y peso permitido',
      'Emisiones para motor diésel',
      'Verificación de elementos de seguridad',
      'Certificado oficial MTC'
    ]
  },
  {
    title: 'Vehículos Menores (L3 y L5)',
    img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    desc: 'Motocicletas y mototaxis en sedes con línea de moto: Canta Callao, Ayacucho, Huancavelica y Andahuaylas.',
    detalle:
      'Revisión técnica de vehículos menores L3 y L5 (motocicletas y mototaxis) según el calendario del MTC. Atención ágil para repartidores y mototaxis, con emisión del certificado en el acto. Disponible en las sedes Canta Callao, Ayacucho, Huancavelica y Andahuaylas.',
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
        title="Revisión Técnica Vehicular en el Perú | RTP San Cristóbal"
        description="Revisión técnica vehicular autorizada por el MTC en 20 minutos: autos particulares, transporte de personas, transporte de mercancías y vehículos menores L3 y L5 (motos). Sedes en Lima y provincias. Consulta tu revisión técnica, placa o gas."
        schema={schemaGrafo([schemaNegocio, schemaFaq(FAQ_HOME)])}
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
                Somos una empresa comprometida con la{' '}
                <strong className="text-gray-900">seguridad vial y la certificación técnica vehicular</strong> en el
                Perú. Ofrecemos revisiones técnicas para autos particulares, transporte de personas y transporte de
                mercancías, garantizando que cada vehículo cumpla con los requisitos técnicos exigidos por la
                normativa nacional.
              </p>
              <p className="content-text text-gray-600 max-w-lg">
                Nuestra labor asegura que los vehículos circulen en óptimas condiciones y contribuye a reducir los
                accidentes de tránsito y la contaminación ambiental. Contamos con un equipo altamente capacitado y
                tecnología de vanguardia para brindar un servicio eficiente, confiable y accesible, con{' '}
                <strong className="text-gray-900">más de 10 años de experiencia</strong> y más de 700 000 atenciones
                que respaldan nuestra trayectoria.
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
                      <p className="stat-num text-3xl font-black text-orange-500">700K+</p>
                      <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wider mt-1">Atenciones</p>
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
              de cuatro (una por servicio) en desktop. */}
          <div
            ref={servicios.trackRef}
            onScroll={servicios.alDesplazar}
            onPointerDown={servicios.pausar}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x md:snap-none scrollbar-hide"
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
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-black text-gray-900 mb-3">{item.title}</h3>
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

      {/* FAQ: mismo contenido que el schema FAQPage de arriba. Sin este bloque
          visible Google no muestra los desplegables en los resultados. */}
      <RevealOnScroll>
        <section className="max-w-4xl mx-auto px-4 section">
          <div className="text-center mb-10">
            <h4 className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-3">Resolvemos tus dudas</h4>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Preguntas Frecuentes</h2>
          </div>
          <div className="space-y-4">
            {FAQ_HOME.map(faq => (
              <details
                key={faq.q}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm open:shadow-md transition-shadow"
              >
                <summary className="cursor-pointer list-none px-6 py-5 flex items-start justify-between gap-4 text-left">
                  <span className="text-base font-black text-gray-900">{faq.q}</span>
                  <span className="text-orange-500 font-black text-xl leading-none shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="px-6 pb-6 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
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
