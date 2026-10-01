import { ShieldCheck, Target, Eye, Gauge, MapPin, X, Navigation, Clock, Building2, Truck, CheckCircle2, ChevronDown } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import RevealOnScroll from '../components/RevealOnScroll';
import { Helmet } from 'react-helmet-async';
import PremiumButton from '../components/PremiumButton';
import ReactDOM from 'react-dom';
import { useRef, useState, useEffect } from 'react';

import escuelaLogo from '../../resources/assets/escuela_logo.png';
import policlinicosLogo from '../../resources/assets/policlinicos_logo.png';

/**
 * Ancho de cada card del carrusel de planes.
 * El carrusel usa `gap-6` (1.5rem), así que el ancho tiene que descontar la
 * mitad del gap en cada lado para que N cards + N-1 gaps llenen el 100%:
 *   2 cards -> (100% - 1.5rem) / 2 = calc(50% - 0.75rem)
 *   3 cards -> (100% - 3rem)   / 3 = calc(33.3333% - 1rem)
 * Estas clases van en el RevealOnScroll, que es el hijo flex real: si se
 * dejan en el div interior, el ancho se resuelve contra el contenido y las
 * cards se encogen de forma impredecible.
 */
const PLAN_CARD_WIDTH =
  'shrink-0 snap-start w-[88%] sm:w-[62%] md:w-[calc(50%-0.75rem)] lg:w-[calc(33.3333%-1rem)]';

/* Componente Milestone para la línea de tiempo */
interface MilestoneProps {
  year: string;
  title: string;
  description: string;
  image: string;
  number: string;
  side: 'left' | 'right';
  featured?: boolean;
}

function Milestone({ year, title, description, image, number, side, featured }: MilestoneProps) {
  const isLeft = side === 'left';

  return (
    <div className={`relative flex flex-col lg:flex-row gap-8 lg:gap-12 ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center`}>
      {/* Conector en la línea central (solo desktop) */}
      <div className={`hidden lg:block lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-10 lg:h-10 lg:rounded-full lg:border-4 lg:shadow-lg lg:z-10 lg:flex lg:items-center lg:justify-center ${
        featured ? 'bg-gradient-to-br from-orange-400 to-orange-600 border-white/20' : 'bg-white border-orange-400'
      }`}>
        {featured ? (
          <>
            <div className="absolute inset-2 bg-white rounded-full"></div>
            <div className="absolute inset-3 bg-orange-500 rounded-full animate-pulse"></div>
          </>
        ) : (
          <div className="absolute inset-1 bg-orange-400 rounded-full animate-pulse"></div>
        )}
      </div>

      {/* Contenido textual */}
      <div className={`flex-1 min-w-0 ${isLeft ? 'lg:text-right lg:pr-8' : 'lg:pl-8'} lg:w-1/2 text-center lg:text-left`}>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 lg:mx-auto lg:mb-4 ${
          featured ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' : 'bg-gray-900 text-orange-400 border border-gray-800'
        }`}>
          <span className={`w-2 h-2 rounded-full animate-pulse ${featured ? 'bg-white' : 'bg-orange-400'}`} />
          {year}
        </div>
        <h3 className="text-2xl lg:text-3xl font-black text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 leading-relaxed lg:text-lg">{description}</p>
      </div>

      {/* Imagen con marco */}
      <div className={`relative lg:w-1/2 lg:flex lg:items-center ${isLeft ? 'lg:order-last' : 'lg:order-first'}`}>
        <div className={`relative rounded-2xl overflow-hidden shadow-xl transition-all duration-700 group-hover:scale-[1.02] ${
          featured ? 'h-80 lg:h-96 border-2 border-orange-400/50' : 'h-72 lg:h-80 border border-gray-200'
        }`}>
          <img
            src={image}
            alt={year}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className={`absolute inset-0 transition-opacity duration-300 ${
            featured ? 'bg-gradient-to-t from-orange-900/30 to-transparent' : 'bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100'
          }`} />
        </div>
        {/* Badge número decorativo */}
        <div className={`absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-6 w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center text-2xl lg:text-3xl font-black ${
          featured ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white border-2 border-white/20 shadow-2xl shadow-orange-500/50' : 'bg-gradient-to-br from-gray-900 to-gray-800 text-orange-400 border-2 border-orange-400'
        }`}>
          {number}
        </div>
      </div>
    </div>
  );
}

// Interface para las sucursales
interface ServiceBranch {
  id: number;
  name: string;
  address: string;
  whatsapp: string;
  coordinates?: { lat: number; lng: number };
  schedule?: string;
  phone?: string;
  courses?: string[];  // Cursos disponibles
  services?: string[]; // Servicios (para policlínicos)
  circuit?: string;    // Circuito de prácticas
  circuitAddress?: string; // Dirección del circuito
}

// Datos de escuelas de conductores
const escuelaBranches: ServiceBranch[] = [
  {
    id: 101,
    name: 'Escuela San Cristobal Vip Lima',
    address: 'Av. Carlos Izaguirre 108 (3er Piso), Lima',
    whatsapp: '51999111222',
    coordinates: { lat: -11.9686, lng: -77.0708 },
    schedule: 'Lun - Sab: 8:00 - 18:00',
    phone: '(01) 555-1234',
    courses: ['Licencia A-I (Motos)', 'Licencia A-IIa (Auto)', 'Licencia A-IIb (Camioneta)', 'Licencia A-IIIa (Transporte público)', 'Recategorización'],
    circuit: 'Circuito Vip Los Olivos',
    circuitAddress: 'Av. Universitaria con Calle Las Palmeras, Los Olivos'
  },
  {
    id: 102,
    name: 'Escuela San Cristobal Vip Callao',
    address: 'Av. Nestor Gambeta 1, 2 y 3, Callao',
    whatsapp: '51999333444',
    coordinates: { lat: -11.9843, lng: -77.1251 },
    schedule: 'Lun - Sab: 8:00 - 18:00',
    phone: '(01) 555-5678',
    courses: ['Licencia A-I (Motos)', 'Licencia A-IIa (Auto)', 'Licencia A-IIb (Camioneta)', 'Licencia A-IIIa (Transporte público)'],
    circuit: 'Circuito Gambeta Callao',
    circuitAddress: 'Av. Néstor Gambeta Km 5.5, Callao'
  },
  {
    id: 103,
    name: 'Escuela San Cristobal Vip Huacho',
    address: 'Huacho, falta informacion',
    whatsapp: '958077827',
    coordinates: { lat: -11.1075, lng: -77.6050 },
    schedule: 'Lun - Sab: 8:00 - 17:00',
    courses: ['Licencia A-I (Motos)', 'Licencia A-IIa (Auto)', 'Licencia A-IIb (Camioneta)'],
    circuit: 'Circuito Huacho',
    circuitAddress: 'Por confirmar'
  },
  {
    id: 104,
    name: 'Escuela Mi Brevete Seguro Ayacucho',
    address: 'Ayacucho, falta informacion',
    whatsapp: '958077827',
    coordinates: { lat: -13.1588, lng: -74.2232 },
    schedule: 'Lun - Sab: 8:00 - 17:00',
    courses: ['Licencia A-I (Motos)', 'Licencia A-IIa (Auto)', 'Licencia A-IIb (Camioneta)'],
    circuit: 'Circuito Ayacucho Centro',
    circuitAddress: 'Por confirmar'
  },
  {
    id: 105,
    name: 'Escuela Mi Brevete Seguro Huancavelica',
    address: 'Huancavelica, falta informacion',
    whatsapp: '958077827',
    coordinates: { lat: -12.7864, lng: -74.9764 },
    schedule: 'Lun - Sab: 8:00 - 17:00',
    courses: ['Licencia A-I (Motos)', 'Licencia A-IIa (Auto)'],
    circuit: 'Circuito Huancavelica',
    circuitAddress: 'Por confirmar'
  },
  {
    id: 106,
    name: 'Escuela Mi Brevete Seguro Ate',
    address: 'Ate, falta informacion',
    whatsapp: '948582159',
    coordinates: { lat: -12.0277, lng: -76.9186 },
    schedule: 'Lun - Sab: 8:00 - 18:00',
    courses: ['Licencia A-I (Motos)', 'Licencia A-IIa (Auto)', 'Licencia A-IIb (Camioneta)', 'Recategorización'],
    circuit: 'Circuito Ate Vitarte',
    circuitAddress: 'Av. Nicolás Ayllón, Ate'
  },
  {
    id: 107,
    name: 'Escuela San Cristobal del Perú Ica',
    address: 'Ica, me falta infooo',
    whatsapp: '958077827',
    coordinates: { lat: -14.0678, lng: -75.7286 },
    schedule: 'Lun - Sab: 8:00 - 17:00',
    courses: ['Licencia A-I (Motos)', 'Licencia A-IIa (Auto)', 'Licencia A-IIb (Camioneta)'],
    circuit: 'Circuito Ica',
    circuitAddress: 'Por confirmar'
  },
  {
    id: 108,
    name: 'Escuela San Cristobal del Perú Andahuaylas',
    address: 'Andahuaylas, me falta infooo',
    whatsapp: '958077827',
    coordinates: { lat: -13.6557, lng: -73.3873 },
    schedule: 'Lun - Sab: 8:00 - 17:00',
    courses: ['Licencia A-I (Motos)', 'Licencia A-IIa (Auto)'],
    circuit: 'Circuito Andahuaylas',
    circuitAddress: 'Por confirmar'
  }
];

// Datos de policlínicos
const policlinicosBranches: ServiceBranch[] = [
  {
    id: 201,
    name: 'Policlínico San Luis Medic Lima',
    address: 'Av. Carlos Izaguirre 108 (2do Piso)',
    whatsapp: '51999555666',
    coordinates: { lat: -11.9686, lng: -77.0708 },
    schedule: 'Lun - Sab: 7:00 - 19:00',
    phone: '(01) 555-9012',
    services: ['Examen médico para brevete', 'Examen psicológico', 'Certificado de salud', 'Test de drogas', 'Evaluación oftalmológica']
  },
  {
    id: 202,
    name: 'Policlínico Brevetes Apurimac Ayacucho',
    address: 'Calle Oeste 321, Ayacucho',
    whatsapp: '51999777888',
    coordinates: { lat: -13.1588, lng: -74.2232 },
    schedule: 'Lun - Sab: 7:00 - 18:00',
    services: ['Examen médico para brevete', 'Examen psicológico', 'Certificado de salud']
  },
  {
    id: 203,
    name: 'Policlinico San Luis Medic Andahuaylas',
    address: 'Andahuaylas, falta informacion',
    whatsapp: '958077827',
    coordinates: { lat: -13.6557, lng: -73.3873 },
    schedule: 'Lun - Sab: 7:00 - 17:00',
    services: ['Examen médico para brevete', 'Examen psicológico', 'Certificado de salud']
  },
];
const helmetContent = (
  <Helmet>
    <title>Nosotros | Grupo San Cristóbal - Líderes en Revisiones Técnicas</title>
    <meta name="description" content="Conoce al Grupo San Cristóbal, líderes en revisiones técnicas vehiculares e inspección técnica vehicular. Tecnología europea de última generación y profesionales capacitados." />
    <meta name="keywords" content="nosotros, grupo san cristobal, revisiones tecnicas, inspeccion tecnica vehicular, seguridad vial, tecnologia europea" />
    <link rel="canonical" href="https://tu-dominio.com/nosotros" />
  </Helmet>
);
const Counter = ({ end, duration = 2000, suffix = "" }: { end: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start * 10) / 10);
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [inView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

function Nosotros() {
  const [showEscuela, setShowEscuela] = useState(false);
  const [showPoliclinicos, setShowPoliclinicos] = useState(false);
  
  const [selectedBranch, setSelectedBranch] = useState<ServiceBranch | null>(null);
  const [branchType, setBranchType] = useState<'escuela' | 'policlinico'>('escuela');
  const [planIndex, setPlanIndex] = useState(0);
  const scrollPositionRef = useRef(0);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (selectedBranch) {
      scrollPositionRef.current = window.scrollY;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedBranch]);

  const openBranchModal = (branch: ServiceBranch, type: 'escuela' | 'policlinico') => {
    setSelectedBranch(branch);
    setBranchType(type);
  };

  const closeBranchModal = () => {
    setSelectedBranch(null);
  };

  const openGoogleMaps = (branch: ServiceBranch) => {
    if (branch.coordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${branch.coordinates.lat},${branch.coordinates.lng}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const openWhatsApp = (branch: ServiceBranch) => {
    const url = `https://wa.me/${branch.whatsapp}?text=Hola,%20quiero%20información%20de%20${encodeURIComponent(branch.name)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {helmetContent}
      <div className="bg-[#f8fafc] overflow-hidden">
        {/* 1. HERO SECTION */}
        <section className="page-banner">
          {/* Background Layer with uniform overlay */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
            <RevealOnScroll>
              <div className="max-w-4xl flex items-center gap-8 group">
                <div className="w-1.5 h-20 bg-orange-500 rounded-full shrink-0 animate-grow-vertical" />
                <div className="space-y-4">
                  <h1 className="banner-title text-white animate-grow-text">
                    Compromiso con la <span className="text-orange-500">Excelencia</span> Vial
                  </h1>
                  <p className="banner-description text-gray-400 max-w-2xl">
                    Definiendo los estándares de seguridad técnica a través de la precisión quirúrgica en cada inspección y diagnóstico.
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Bottom Decorative Detail */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-orange-500/0 to-transparent opacity-50" />
        </section>

        {/* 2. VISION / MISSION / VALUES GRID */}
        <section className="max-w-7xl mx-auto px-4 section -mt-20 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Card: Vision */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col md:flex-row p-8 gap-8 group">
              <div className="flex-1 space-y-6">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                  <Eye size={30} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 leading-tight">Nuestra Visión</h3>
                <p className="content-text text-gray-500">
                  Ser el referente global en transparencia técnica, integrando inteligencia artificial y precisión mecánica para eliminar el riesgo en las carreteras del futuro.
                </p>
              </div>
              <div className="flex-1 rounded-xl overflow-hidden h-48 md:h-auto">
                <img
                  src="https://images.unsplash.com/photo-1551816230-ef5deaed4a26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Vision"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Card: Stats (Orange) */}
            <div className="bg-orange-500 rounded-2xl p-8 flex flex-col justify-center items-center text-center text-white shadow-xl shadow-orange-500/20 group">
              <h4 className="stat-num text-6xl font-black mb-2 tracking-tighter">
                <Counter end={99.9} suffix="%" />
              </h4>
              <p className="text-xs uppercase tracking-[0.2em] font-bold opacity-80 mb-6">Índice de Precisión</p>
              <p className="text-sm font-medium opacity-90 border-t border-white/20 pt-6">
                Avalados por certificaciones internacionales de calibración.
              </p>
            </div>

            {/* Card: Values */}
            <div className="bg-[#e0e7ff] rounded-2xl p-8 flex flex-col justify-center gap-6">
              <h3 className="text-2xl font-bold text-gray-900">Valores Fundamentales</h3>
              <ul className="space-y-5">
                {[
                  { label: "Transparencia Radical", icon: Target, desc: "Resultados trazables e inalterables." },
                  { label: "Rigor Técnico", icon: Gauge, desc: "Cero margen de error en diagnósticos." },
                  { label: "Seguridad Humana", icon: ShieldCheck, desc: "Nuestra prioridad es la vida del conductor." }
                ].map((val, i) => (
                  <li key={i} className="flex gap-4 items-start group">
                    <div className="bg-white/50 p-2.5 rounded-lg text-orange-600 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                      <val.icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bold text-gray-900 text-sm">{val.label}</h5>
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-0.5 leading-relaxed">{val.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Card: Mission (Dark) */}
            <div className="lg:col-span-4 bg-[#0a0f1a] rounded-2xl overflow-hidden flex flex-col md:flex-row p-1 gap-0 group shadow-2xl">
              <div className="flex-1 p-10 md:p-16 space-y-8 md:border-r border-white/5">
                <div className="space-y-4">
                  <h3 className="text-4xl font-bold text-white tracking-tight">Nuestra Misión</h3>
                  <div className="w-16 h-1 bg-orange-500" />
                </div>
                <p className="content-text text-gray-400 max-w-xl">
                  Proveer un servicio de inspección técnica vehicular de élite, garantizando que cada vehículo en circulación cumpla con los más altos estándares de integridad mecánica a través de tecnología de punta y personal experto.
                </p>
              </div>
              <div className="md:w-1/3 relative">
                <img
                  src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Mission"
                  className="w-full h-full object-cover transition-opacity duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1a] via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* 3. TIMELINE SECTION (HITOS DE INNOVACIÓN) - LÍNEA DE TIEMPO LIMPIA */}
        <section className="bg-gradient-to-b from-gray-50 to-white section relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <p className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4">TRAYECTORIA</p>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Hitos de Innovación</h2>
              <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto">
                Una década transformando la seguridad vial a través de la excelencia técnica.
              </p>
            </div>

            {/* Línea central vertical - dentro del contenedor para alinear con los conectores */}
            <div className="absolute left-1/2 top-24 bottom-24 w-1 bg-gradient-to-b from-orange-200 via-orange-400 to-orange-600 -translate-x-1/2 hidden lg:block" />
            <div className="absolute left-1/2 top-24 bottom-24 w-[4px] bg-orange-500/30 -translate-x-1/2 lg:hidden" />

            <div className="space-y-16 lg:space-y-20">
              {/* Hito 1 - 2014 */}
              <RevealOnScroll className="group">
                <Milestone
                  year="2014"
                  title="Fundación"
                  description="Nacimiento del primer taller Técnico en la región, revolucionando los estándares con profesionales de la industria."
                  image="https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  number="01"
                  side="left"
                />
              </RevealOnScroll>

              {/* Hito 2 - 2019 */}
              <RevealOnScroll className="group delay-200">
                <Milestone
                  year="2019"
                  title="Innovación Digital"
                  description="Implementación de diagnósticos basados en la nube y reportes digitales automatizados para transparencia total."
                  image="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  number="02"
                  side="right"
                />
              </RevealOnScroll>

              {/* Hito 3 - 2025 */}
              <RevealOnScroll className="group delay-400">
                <Milestone
                  year="2025"
                  title="Liderazgo Regional"
                  description="Consolidación como la red de inspección técnica más avanzada del continente, con más de 30 centros operativos."
                  image="https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  number="03"
                  side="left"
                  featured
                />
              </RevealOnScroll>

              {/* Meta */}
              <div className="relative lg:hidden">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 rounded-full border-2 border-orange-400 shadow-xl mx-auto">
                  <div className="w-5 h-5 bg-gradient-to-br from-white to-gray-200 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-white font-bold">META: Excelencia Continua</span>
                  <div className="w-5 h-5 bg-gradient-to-br from-white to-gray-200 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Meta de llegada - Solo desktop */}
            <div className="hidden lg:block mt-12 text-center">
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-full border-2 border-orange-400 shadow-2xl">
                <div className="w-6 h-6 bg-gradient-to-br from-white to-gray-200 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                </div>
                <span className="text-white font-black text-lg">META: Excelencia Continua</span>
                <div className="w-6 h-6 bg-gradient-to-br from-white to-gray-200 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CONVENIOS Y PLANES EMPRESARIALES */}
        <section className="max-w-7xl mx-auto px-4 section border-t border-gray-100">
          <div className="text-center mb-12">
            <p className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4">SOLUCIONES B2B</p>
            <h2 className="text-5xl font-bold text-gray-900 tracking-tight mb-6">Planes para cada <span className="text-orange-500">Necesidad</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium text-lg">Ofrecemos programas integrales de revisión técnica diseñados para optimizar la gestión de su flota vehicular.</p>
          </div>

          {/* Carrusel: 1 card en móvil, 2 en tablet, 3 en desktop. Scrollbar oculta, puntos indicadores. */}
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 -mx-4 px-4 scrollbar-hide">
              {/* Card 1: Flotas de Empresa */}
              <RevealOnScroll className={PLAN_CARD_WIDTH}>
                <div className="h-full bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col">
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1586528116311-ad86d3ef37f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Flotas"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-6 left-6 p-4 bg-white/95 backdrop-blur rounded-2xl shadow-xl">
                      <Building2 className="text-orange-600 w-7 h-7" />
                    </div>
                  </div>
                  <div className="p-10 flex flex-col">
                    <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Flotas de Empresa</h3>
                    <p className="text-gray-500 mb-8 leading-relaxed font-medium">
                      Optimice la gestión técnica de sus vehículos comerciales con tarifas preferenciales y facturación centralizada.
                    </p>
                    <div className="space-y-4 mb-10">
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                        <CheckCircle2 size={18} className="text-orange-500" />
                        <span>Descuentos por volumen</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                        <CheckCircle2 size={18} className="text-orange-500" />
                        <span>Reportes mensuales de estado</span>
                      </div>
                    </div>
                    <PremiumButton to="/contacto" className="mt-auto w-full py-4 text-sm uppercase tracking-widest bg-gray-50 !text-gray-900 hover:!text-white border-none shadow-none">
                      Saber más
                    </PremiumButton>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Card 2: Empresas de Transporte */}
              <RevealOnScroll className={`delay-200 ${PLAN_CARD_WIDTH}`}>
                <div className="h-full bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col">
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Transporte"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-6 left-6 p-4 bg-white/95 backdrop-blur rounded-2xl shadow-xl">
                      <Truck className="text-orange-600 w-7 h-7" />
                    </div>
                  </div>
                  <div className="p-10 flex flex-col">
                    <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Transporte de Carga</h3>
                    <p className="text-gray-500 mb-8 leading-relaxed font-medium">
                      Prioridad en turnos y atención técnica especializada para vehículos pesados y de transporte logístico.
                    </p>
                    <div className="space-y-4 mb-10">
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                        <CheckCircle2 size={18} className="text-orange-500" />
                        <span>Horarios flexibles VIP</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                        <CheckCircle2 size={18} className="text-orange-500" />
                        <span>Asesoría técnica normativa</span>
                      </div>
                    </div>
                    <PremiumButton to="/contacto" className="mt-auto w-full py-4 text-sm uppercase tracking-widest bg-gray-50 !text-gray-900 hover:!text-white border-none shadow-none">
                      Saber más
                    </PremiumButton>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Card 3: Aseguradoras */}
              <RevealOnScroll className={`delay-400 ${PLAN_CARD_WIDTH}`}>
                <div className="h-full bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col">
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Aseguradoras"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-6 left-6 p-4 bg-white/95 backdrop-blur rounded-2xl shadow-xl">
                      <ShieldCheck className="text-orange-600 w-7 h-7" />
                    </div>
                  </div>
                  <div className="p-10 flex flex-col">
                    <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Aliados de Seguros</h3>
                    <p className="text-gray-500 mb-8 leading-relaxed font-medium">
                      Integración de servicios para siniestros y revisiones preventivas personalizadas para todos sus asegurados.
                    </p>
                    <div className="space-y-4 mb-10">
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                        <CheckCircle2 size={18} className="text-orange-500" />
                        <span>Validación digital inmediata</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                        <CheckCircle2 size={18} className="text-orange-500" />
                        <span>Red de beneficios compartida</span>
                      </div>
                    </div>
                    <PremiumButton to="/contacto" className="mt-auto w-full py-4 text-sm uppercase tracking-widest bg-gray-50 !text-gray-900 hover:!text-white border-none shadow-none">
                      Saber más
                    </PremiumButton>
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            {/* Puntos indicadores (solo móvile/tablet) */}
            <div className="flex justify-center gap-2 mt-4 md:hidden">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPlanIndex(i)}
                  aria-label={`Ir al plan ${i + 1}`}
                  aria-current={planIndex === i}
                  className={`h-2 transition-all duration-300 ${
                    planIndex === i ? 'w-8 bg-[#f97316]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                  } rounded-full`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 5. SERVICIOS COMPLEMENTARIOS (ESCUELA / POLICLINICOS) */}
        <section className="bg-gray-50 section border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4">MÁS QUE REVISIONES</p>
              <h2 className="text-5xl font-bold text-gray-900 tracking-tight mb-6">Servicios <span className="text-orange-500">Complementarios</span></h2>
              <p className="text-gray-500 max-w-2xl mx-auto font-medium text-lg">Nuestra red de excelencia incluye formación especializada y servicios médicos certificados.</p>
            </div>

            <div className={`grid gap-12 transition-all duration-300 ${showEscuela || showPoliclinicos ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
              {/* Escuela de Conductores */}
              <RevealOnScroll>
                <div className={`bg-white border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-[40px] ${showEscuela ? 'md:col-span-1' : ''}`}>
                  <div className="relative h-64 overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Escuela" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                    <div className="absolute bottom-8 left-10 right-10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-xl">
                          <img src={escuelaLogo} alt="Logo Escuela" className="w-full h-full object-contain" />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Escuela de Conductores</h3>
                      </div>
                      <button
                        className="bg-orange-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-white hover:text-orange-500 transition-all shadow-lg"
                        onClick={() => {
                          setShowEscuela(!showEscuela);
                          if (!showEscuela) setShowPoliclinicos(false);
                        }}
                      >
                        <ChevronDown size={24} className={`transition-transform duration-300 ${showEscuela ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <div className={`transition-all duration-500 ease-in-out ${showEscuela ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="p-10">
                      <p className="text-gray-500 font-medium mb-10 leading-relaxed text-lg">Formamos conductores profesionales con los más altos estándares de calidad y seguridad vial.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {escuelaBranches.map((branch) => (
                          <div
                            key={branch.id}
                            className="p-6 border border-gray-100 rounded-3xl bg-gray-50 hover:border-orange-500 transition-all hover:shadow-xl cursor-pointer group"
                            onClick={() => openBranchModal(branch, 'escuela')}
                          >
                            <h4 className="font-black text-gray-900 text-sm mb-2 group-hover:text-orange-600 transition-colors uppercase tracking-tight">{branch.name}</h4>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{branch.address}</p>
                            <p className="text-[10px] text-orange-500 font-black mt-4 uppercase tracking-[0.2em]">Más info →</p>
                          </div>
                        ))}
                      </div>
                      <PremiumButton className="w-full py-5 text-lg">Ir a la web oficial</PremiumButton>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Policlínicos */}
              <RevealOnScroll className="delay-200">
                <div className={`bg-white border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-[40px] ${showPoliclinicos ? 'md:col-span-1' : ''}`}>
                  <div className="relative h-64 overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Policlínicos" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                    <div className="absolute bottom-8 left-10 right-10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-xl">
                          <img src={policlinicosLogo} alt="Logo Policlínicos" className="w-full h-full object-contain" />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Policlínicos Médicos</h3>
                      </div>
                      <button
                        className="bg-orange-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-white hover:text-orange-500 transition-all shadow-lg"
                        onClick={() => {
                          setShowPoliclinicos(!showPoliclinicos);
                          if (!showPoliclinicos) setShowEscuela(false);
                        }}
                      >
                        <ChevronDown size={24} className={`transition-transform duration-300 ${showPoliclinicos ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <div className={`transition-all duration-500 ease-in-out ${showPoliclinicos ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="p-10">
                      <p className="text-gray-500 font-medium mb-10 leading-relaxed text-lg">Servicios médicos especializados para la obtención de licencias de conducir y certificados de salud.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {policlinicosBranches.map((branch) => (
                          <div
                            key={branch.id}
                            className="p-6 border border-gray-100 rounded-3xl bg-gray-50 hover:border-orange-500 transition-all hover:shadow-xl cursor-pointer group"
                            onClick={() => openBranchModal(branch, 'policlinico')}
                          >
                            <h4 className="font-black text-gray-900 text-sm mb-2 group-hover:text-orange-600 transition-colors uppercase tracking-tight">{branch.name}</h4>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{branch.address}</p>
                            <p className="text-[10px] text-orange-500 font-black mt-4 uppercase tracking-[0.2em]">Más info →</p>
                          </div>
                        ))}
                      </div>
                      <PremiumButton className="w-full py-5 text-lg">Ir a la web oficial</PremiumButton>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>


        {/* Modal Popup para información de sucursal - Usando Portal para asegurar centrado */}
        {selectedBranch && ReactDOM.createPortal(
          <>
            <div className="modal-overlay" onClick={closeBranchModal} />
            <div className="modal-container">
              <div className="modal-content bg-white rounded-[40px] max-w-4xl w-full shadow-2xl overflow-hidden animate-entry-slide-down" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col md:flex-row overflow-y-auto md:overflow-hidden" style={{ maxHeight: '90vh' }}>
                  {/* Columna izquierda - Imagen */}
                  <div className="md:w-2/5 relative min-h-[250px] md:min-h-[600px]">
                    <img
                      src={branchType === 'escuela'
                        ? 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                        : 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                      }
                      alt="Servicio"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 ${branchType === 'escuela' ? 'bg-orange-900/60' : 'bg-gray-900/60'} backdrop-blur-[2px]`} />
                    <div className="absolute inset-0 flex flex-col justify-center items-center p-10 text-center">
                      <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6 ring-8 ring-white/10">
                        <img src={branchType === 'escuela' ? escuelaLogo : policlinicosLogo} alt="Logo" className="w-16 h-16 object-contain" />
                      </div>
                      <p className="text-white font-black text-sm uppercase tracking-[0.3em] opacity-80">{branchType === 'escuela' ? 'Escuela de Conductores' : 'Centro Médico'}</p>
                    </div>
                  </div>

                  {/* Columna derecha - Info */}
                  <div className="md:w-3/5 flex flex-col bg-white">
                    <div className={`p-10 ${branchType === 'escuela' ? 'bg-orange-500' : 'bg-gray-900'} text-white relative`}>
                      <button onClick={closeBranchModal} className="absolute top-8 right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"><X size={20} /></button>
                      <h3 className="text-3xl font-black uppercase tracking-tight leading-tight pr-12">{selectedBranch.name}</h3>
                    </div>

                    <div className="p-10 space-y-8 flex-1 overflow-y-auto">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-orange-500 shrink-0"><MapPin size={22} /></div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Dirección</p>
                            <p className="text-gray-900 font-bold text-sm">{selectedBranch.address}</p>
                          </div>
                        </div>
                        {selectedBranch.schedule && (
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-orange-500 shrink-0"><Clock size={22} /></div>
                            <div>
                              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Horario</p>
                              <p className="text-gray-900 font-bold text-sm">{selectedBranch.schedule}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {selectedBranch.courses && (
                        <div className="pt-8 border-t border-gray-100">
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4">Cursos Disponibles</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedBranch.courses.map((c, i) => (
                              <span key={i} className="px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-[11px] font-black uppercase tracking-widest border border-orange-100">{c}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedBranch.services && (
                        <div className="pt-8 border-t border-gray-100">
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4">Servicios Médicos</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedBranch.services.map((s, i) => (
                              <span key={i} className="px-4 py-2 bg-gray-50 text-gray-600 rounded-full text-[11px] font-black uppercase tracking-widest border border-gray-200">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-10 pt-4 grid grid-cols-2 gap-4 bg-gray-50 border-t border-gray-100">
                      <button onClick={() => openWhatsApp(selectedBranch)} className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-green-500/20 transition-all active:scale-95">
                        <FaWhatsapp size={18} /> WhatsApp
                      </button>
                      <button onClick={() => openGoogleMaps(selectedBranch)} className="flex items-center justify-center gap-3 bg-black hover:bg-gray-800 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all">
                        <Navigation size={18} /> Navegar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
      </div>
    </>
  );
}

export default Nosotros;

