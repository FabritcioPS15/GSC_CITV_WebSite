import {
  ShieldCheck,
  Target,
  Eye,
  Gauge,
  MapPin,
  X,
  Navigation,
  Clock,
  Building2,
  Truck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Award,
  Users,
  Wrench,
  Cpu,
  ClipboardCheck
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import RevealOnScroll from '../components/RevealOnScroll';
import Seo from '../components/Seo';
import { schemaBreadcrumbs } from '../seo/schemas';
import PremiumButton from '../components/PremiumButton';
import ReactDOM from 'react-dom';
import { useRef, useState, useEffect } from 'react';
import { whatsappUrl, WHATSAPP_INSPECCION, FOTOS_CANTA_CALLAO, FOTOS_HUANCAVELICA, FOTOS_AYACUCHO_FENIX } from '../../backend/data/branches';
import { useBloqueoScroll } from '../hooks/useBloqueoScroll';

import escuelaLogo from '../../resources/assets/escuela_logo.png';
import policlinicosLogo from '../../resources/assets/policlinicos_logo.png';

/**
 * Fotos reales de sedes (public/ WEB FOTOS) para que la página muestre nuestra
 * propia red en lugar de imágenes genéricas. Si alguna carpeta se mueve, cada
 * uso vuelve a quedar con la imagen de respaldo.
 */
const FOTO_QUIENES = FOTOS_CANTA_CALLAO[0]?.src;
const FOTO_VISION = FOTOS_HUANCAVELICA[0]?.src;
const FOTO_MISION = FOTOS_AYACUCHO_FENIX[0]?.src;

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

/* Planes B2B. Cada tarjeta del carrusel se genera desde aquí y el popup de
   "Saber más" consume los mismos campos, así que no hay que duplicar textos. */
interface PlanB2B {
  id: string;
  titulo: string;
  resumen: string;
  imagen: string;
  alt: string;
  destacado: string[];
  detalle: string;
  incluye: string[];
  idealPara: string;
}

const PLANES: PlanB2B[] = [
  {
    id: 'flotas',
    titulo: 'Flotas de Empresa',
    resumen:
      'Optimice la gestión técnica de sus vehículos comerciales con tarifas preferenciales y facturación centralizada.',
    imagen: 'https://images.unsplash.com/photo-1586528116311-ad86d3ef37f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Flota de vehículos de reparto en un estacionamiento',
    destacado: ['Descuentos por volumen', 'Reportes mensuales de estado'],
    detalle:
      'Si su empresa tiene vehículos propios o arrendados, la revisión técnica deja de ser una tarea suelta del conductor y pasa a ser una línea dentro de su plan de mantenimiento. Centralizamos la facturación, seguimos el estado de cada unidad y avisamos las revisiones próximas al vencimiento para que ninguna placa se quede fuera de plazo.',
    incluye: [
      'Tarifa corporativa por cantidad de unidades, con tramos de descuento por volumen',
      'Facturación única mensual o trimestral, sin que cada conductor gestione su comprobante',
      'Alertas de vencimiento antes de que la revisión expire',
      'Reporte consolidado por unidad, sede y mes con el detalle de observaciones',
      'Coordinación de citas en la sede que le quede más cerca'
    ],
    idealPara: 'Empresas con cinco o más vehículos propios o arrendados.'
  },
  {
    id: 'transporte',
    titulo: 'Transporte de Carga',
    resumen:
      'Prioridad en turnos y atención técnica especializada para vehículos pesados y de transporte logístico.',
    imagen: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Camiones de carga estacionados en un patio logístico',
    destacado: ['Horarios flexibles VIP', 'Asesoría técnica normativa'],
    detalle:
      'Un camión detenido es mercancía que no se está moviendo. Por eso este plan prioriza el tiempo de taller: atendemos primero a las unidades de transporte de carga y materiales peligrosos, con franjas reservadas fuera del pico y con un técnico disponible para interpretar la norma cuando la revisión no pasa y hay que corregir antes de volver.',
    incluye: [
      'Prioridad de turno en la cola de inspección para unidades pesadas',
      'Atención en ventana extendida y en días de alta demanda',
      'Acompañamiento técnico para resolver las observaciones que causaron el rechazo',
      'Revisión previa de la unidad cuando el transportista lo requiere',
      'Orientación sobre los requisitos vigentes de la categoría del vehículo'
    ],
    idealPara: 'Transportistas de carga, operadores de distribución y empresas con flota pesada.'
  },
  {
    id: 'seguros',
    titulo: 'Aliados de Seguros',
    resumen:
      'Integración de servicios para siniestros y revisiones preventivas personalizadas para todos sus asegurados.',
    imagen: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    alt: 'Asesor de seguros revisando la póliza de un vehículo con el cliente',
    destacado: ['Validación digital inmediata', 'Red de beneficios compartida'],
    detalle:
      'Trabajamos como aliado operativo de aseguradoras: el centro de inspección aporta el dato técnico verificado que la póliza necesita para resolver un siniestro o para prevenir uno. En lugar de una inspección aislada, la aseguradora accede a un histórico del estado mecánico del vehículo y a una red nacional de puntos de atención para sus asegurados.',
    incluye: [
      'Validación técnica de unidades en siniestros, con registro documentado',
      'Historial del estado mecánico consultable por unidad y por asegurado',
      'Cobertura de nuestros centros para las derivaciones de la póliza',
      'Acceso preferencial de los asegurados a nuestra red de sedes',
      'Interlocución técnica directa para resolver discrepancias de peritaje'
    ],
    idealPara: 'Companías aseguradoras y intermediarios que necesitan un aliado técnico en campo.'
  }
];

/* Icono de cada tarjeta, indexado por el id del plan. */
const PLAN_ICON: Record<string, typeof Building2> = {
  flotas: Building2,
  transporte: Truck,
  seguros: ShieldCheck
};

/* Mensaje prellenado para contactar por un plan concreto. */
function mensajePlan(plan: PlanB2B) {
  return `Hola, quisiera información sobre el plan "${plan.titulo}" para empresas.`;
}

/* Hitos de la línea de tiempo de innovación. */
interface Milestone {
  year: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
}

const HITOS: Milestone[] = [
  {
    year: '2014',
    title: 'Fundación',
    description:
      'Nació nuestro primer taller técnico en la región, con profesionales de la industria y un estándar de trabajo que no existía antes en la zona.',
    image: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Técnico inspeccionando un vehículo en el taller'
  },
  {
    year: '2019',
    title: 'Innovación Digital',
    description:
      'Implementamos diagnósticos basados en la nube y reportes digitales automatizados, para que cada resultado sea trazable y verificable por el conductor.',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Panel digital con resultados de una inspección técnica'
  },
  {
    year: '2025',
    title: 'Liderazgo Regional',
    description:
      'Consolidamos la red de inspección técnica más amplia del país, con centros operativos en Lima, Callao y regiones, conectados bajo un mismo estándar de calidad.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Red de centros operativos de inspección técnica'
  }
];

function MilestoneCard({ hito, index }: { hito: Milestone; index: number }) {
  // Alterna lados en escritorio para que la línea central se lea como recorrido.
  const isLeft = index % 2 === 0;
  const number = String(index + 1).padStart(2, '0');

  return (
    <div className="relative z-10 lg:grid lg:grid-cols-2 lg:gap-16">
      {/* Conector sobre la línea central. `lg:top-1/2` es imprescindible: sin
          él el punto se queda en su posición estática (arriba de la fila) y
          queda desalineado del trazo. En móvil sigue a la insignia del año. */}
      <span
        aria-hidden="true"
        className={`absolute top-3 z-20 flex h-6 w-6 items-center justify-center rounded-full border-4 shadow-lg lg:left-1/2 lg:top-1/2 lg:h-11 lg:w-11 lg:-translate-x-1/2 lg:-translate-y-1/2 ${hito.featured
          ? 'border-white/20 bg-gradient-to-br from-orange-400 to-orange-600'
          : 'border-orange-400 bg-white'
          } left-6`}
      >
        <span className={`rounded-full ${hito.featured ? 'bg-orange-500' : 'bg-orange-400'} h-2.5 w-2.5 animate-pulse`} />
      </span>

      {/* Texto. El lado se resuelve con `order` en la rejilla, no con
          text-align: alinear el texto hacia el centro de la línea queda
          consistente en ambos sentidos. */}
      <div
        className={`pl-14 lg:pl-0 ${isLeft ? 'lg:order-1 lg:pr-4 lg:text-right' : 'lg:order-2 lg:pl-4'}`}
      >
        <div
          className={`mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${hito.featured
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
            : 'border border-gray-800 bg-gray-900 text-orange-400'
            }`}
        >
          <span className={`h-2 w-2 shrink-0 rounded-full animate-pulse ${hito.featured ? 'bg-white' : 'bg-orange-400'}`} />
          {hito.year}
        </div>
        <h3 className="mb-4 text-2xl font-black leading-tight text-gray-900 lg:text-3xl">{hito.title}</h3>
        <p className="content-text text-gray-600 lg:text-lg">{hito.description}</p>
      </div>

      {/* Imagen con marco. El envoltorio necesita `relative` para que el badge
          numerado se ancle a la foto y no al `<li>` completo. */}
      <div className={`relative mt-8 lg:mt-0 ${isLeft ? 'lg:order-2' : 'lg:order-1'}`}>
        <div
          className={`group relative overflow-hidden rounded-2xl shadow-xl transition-transform duration-500 hover:scale-[1.02] ${hito.featured ? 'h-72 border-2 border-orange-400/50 lg:h-96' : 'h-64 border border-gray-200 lg:h-80'
            }`}
        >
          <img
            src={hito.image}
            alt={hito.imageAlt}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t from-orange-900/40 to-transparent ${hito.featured ? 'opacity-100' : 'opacity-0 transition-opacity duration-300 group-hover:opacity-100'
              }`}
          />
        </div>
        <span
          className={`absolute -bottom-4 -left-1 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-black shadow-2xl lg:-bottom-6 lg:-left-6 lg:h-20 lg:w-20 lg:text-3xl ${hito.featured
            ? 'border-2 border-white/20 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-orange-500/50'
            : 'border-2 border-orange-400 bg-gradient-to-br from-gray-900 to-gray-800 text-orange-400'
            }`}
          aria-hidden="true"
        >
          {number}
        </span>
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
  <Seo
    path="/nosotros"
    title="Sobre Nosotros | RTP San Cristóbal, Revisión Técnica Vehicular"
    description="Conoce RTP San Cristóbal: más de 15 años en revisión técnica vehicular en el Perú. Tecnología europea, profesionales certificados por el MTC y sedes a nivel nacional."
    schema={schemaBreadcrumbs([
      { name: 'Inicio', path: '/' },
      { name: 'Nosotros', path: '/nosotros' }
    ])}
  />
);
/**
 * Contador animado que arranca cuando el bloque entra en pantalla.
 * `decimals` fija cuántos decimales se muestran: sin él, un valor entero
 * como 30 se renderizaba como 25.6 a mitad del conteo.
 */
const Counter = ({
  end,
  duration = 2000,
  suffix = '',
  decimals = 0,
  format = false
}: {
  end: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
  format?: boolean;
}) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;

    let frame = 0;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      // easeOutCubic: arranca rápido y frena, en lugar de avance lineal.
      const eased = 1 - Math.pow(1 - progress, 3);
      if (progress >= 1) {
        setCount(end);
        return;
      }
      setCount(Number((end * eased).toFixed(decimals)));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, end, duration, decimals]);

  return (
    <span ref={ref}>
      {format ? count.toLocaleString('es-PE') : count}
      {suffix}
    </span>
  );
};

/* Tarjeta desplegable de un servicio complementario (escuela / policlínico). */
interface ComplementarioProps {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  alt: string;
  logo: string;
  tipo: 'escuela' | 'policlinico';
  branches: ServiceBranch[];
  abierto: boolean;
  onToggle: () => void;
  onSelectBranch: (branch: ServiceBranch, type: 'escuela' | 'policlinico') => void;
}

function ComplementarioCard({
  id,
  titulo,
  descripcion,
  imagen,
  alt,
  logo,
  tipo,
  branches,
  abierto,
  onToggle,
  onSelectBranch
}: ComplementarioProps) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[40px] border border-gray-100 bg-white shadow-xl transition-all duration-500 hover:shadow-2xl ${abierto ? 'ring-2 ring-orange-500/30' : ''
        }`}
    >
      {/* Cabecera */}
      <div className="group relative h-64 overflow-hidden">
        <img
          src={imagen}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-6 sm:p-8">
          <div className="flex min-w-0 items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-xl">
              <img src={logo} alt="" className="h-full w-full object-contain" />
            </span>
            <h3 className="text-xl font-black uppercase leading-tight tracking-tight text-white sm:text-2xl">
              {titulo}
            </h3>
          </div>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={abierto}
            aria-controls={`panel-${id}`}
            aria-label={abierto ? `Ocultar ${titulo}` : `Ver ${titulo}`}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg transition-all duration-300 hover:bg-white hover:text-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ChevronDown size={24} className={`transition-transform duration-500 ${abierto ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/*
        Despliegue con grid-rows 0fr -> 1fr: la caja crece hasta la altura real
        del contenido. Con max-height el bloque se estiraba de más durante la
        transición (2000px de sobra) y el relleno inferior seguía creciendo
        después de que el contenido ya se había mostrado.
      */}
      <div
        id={`panel-${id}`}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${abierto ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="border-t border-gray-100 p-6 sm:p-8">
            <p className="content-text mb-6 text-gray-600">{descripcion}</p>

            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              {branches.length} {branches.length === 1 ? 'sucursal' : 'sucursales'} disponible
              {branches.length === 1 ? '' : 's'}
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => onSelectBranch(branch, tipo)}
                  className="group/card flex h-full flex-col items-start rounded-2xl border border-gray-100 bg-gray-50 p-5 text-left transition-all duration-300 hover:border-orange-400 hover:bg-white hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                >
                  <h4 className="mb-1 text-sm font-black uppercase leading-tight tracking-tight text-gray-900 transition-colors group-hover/card:text-orange-600">
                    {branch.name}
                  </h4>
                  <p className="text-xs leading-relaxed text-gray-500">{branch.address}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
                    Más info
                    <ChevronRight size={12} className="transition-transform duration-300 group-hover/card:translate-x-0.5" />
                  </span>
                </button>
              ))}
            </div>

            <a
              href={whatsappUrl(
                WHATSAPP_INSPECCION,
                `Hola, quisiera información sobre ${titulo}.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-green-500 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-600 active:scale-[0.98]"
            >
              <FaWhatsapp size={18} />
              Consultar por {tipo === 'escuela' ? 'este servicio' : 'estos servicios'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Datos de los dos servicios complementarios del accordion. */
const COMPLEMENTARIOS: Omit<ComplementarioProps, 'abierto' | 'onToggle' | 'onSelectBranch'>[] = [
  {
    id: 'escuela',
    titulo: 'Escuela de Conductores',
    descripcion:
      'Formamos conductores profesionales con los más altos estándares de calidad y seguridad vial, con cursos para todas las categorías.',
    imagen:
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Vehículo en una vía urbana',
    logo: escuelaLogo,
    tipo: 'escuela',
    branches: escuelaBranches
  },
  {
    id: 'policlinicos',
    titulo: 'Policlínicos Médicos',
    descripcion:
      'Servicios médicos especializados para la obtención de licencias de conducir y certificados de salud.',
    imagen:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Pasillo de un centro médico',
    logo: policlinicosLogo,
    tipo: 'policlinico',
    branches: policlinicosBranches
  }
];

function Nosotros() {
  const [showEscuela, setShowEscuela] = useState(false);
  const [showPoliclinicos, setShowPoliclinicos] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState<ServiceBranch | null>(null);
  const [branchType, setBranchType] = useState<'escuela' | 'policlinico'>('escuela');
  const [selectedPlan, setSelectedPlan] = useState<PlanB2B | null>(null);
  const [planIndex, setPlanIndex] = useState(0);
  const plansTrackRef = useRef<HTMLDivElement | null>(null);

  const modalAbierto = Boolean(selectedBranch || selectedPlan);

  // Bloquear scroll del body mientras haya cualquier modal abierto.
  useBloqueoScroll(modalAbierto);

  // Escape cierra el modal que esté abierto.
  useEffect(() => {
    if (!modalAbierto) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedBranch(null);
        setSelectedPlan(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalAbierto]);

  const openBranchModal = (branch: ServiceBranch, type: 'escuela' | 'policlinico') => {
    setSelectedBranch(branch);
    setBranchType(type);
  };

  const closeBranchModal = () => {
    setSelectedBranch(null);
  };

  const closePlanModal = () => {
    setSelectedPlan(null);
  };

  /** Índice de la tarjeta más cercana al inicio del carrusel. */
  const syncPlanIndex = (track: HTMLDivElement) => {
    const cards = Array.from(track.children) as HTMLElement[];
    let nearest = 0;
    let minDistance = Infinity;
    cards.forEach((card, i) => {
      const distance = Math.abs(card.offsetLeft - track.offsetLeft - track.scrollLeft);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = i;
      }
    });
    setPlanIndex(nearest);
  };

  /** Desplaza el carrusel hasta la tarjeta indicada, para los puntos indicadores. */
  const goToPlan = (index: number) => {
    const track = plansTrackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement | undefined;
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
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

  const contactarPlan = (plan: PlanB2B) => {
    window.open(whatsappUrl(WHATSAPP_INSPECCION, mensajePlan(plan)), '_blank', 'noopener,noreferrer');
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

        {/* 2. SOBRE NOSOTROS */}
        <section className="section relative z-20 -mt-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid items-center gap-12 rounded-[40px] border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-200/50 md:p-12 lg:grid-cols-12 lg:gap-16 lg:p-14">
              {/* Narrativa */}
              <div className="lg:col-span-7">
                <RevealOnScroll>
                  <p className="mb-4 text-sm font-bold uppercase tracking-widest text-orange-500">Quiénes somos</p>
                  <h2 className="mb-6 text-4xl font-black leading-[1.1] tracking-tight text-gray-900 md:text-5xl">
                    Un grupo peruano que lleva la <span className="text-orange-500">inspección técnica</span> a otro nivel
                  </h2>
                  <div className="content-text max-w-2xl space-y-5 text-gray-500">
                    <p>
                      San Cristóbal es una empresa comprometida con la seguridad vial y la certificación técnica
                      vehicular en el Perú. Ofrecemos un servicio especializado de revisiones técnicas para autos
                      particulares, transporte de personas y transporte de mercancías, garantizando que cada vehículo
                      cumpla con los requisitos técnicos exigidos por la normativa nacional.
                    </p>
                    <p>
                      Nuestra labor no solo asegura que los vehículos circulen en óptimas condiciones, sino que
                      también contribuye a la reducción de accidentes de tránsito y de contaminación ambiental.
                      Contamos con un equipo altamente capacitado y tecnología de vanguardia para brindar un servicio
                      eficiente, confiable y accesible, priorizando siempre la seguridad y el bienestar de nuestros
                      clientes y del país.
                    </p>
                    <p>
                      Nacidos en 2014, hemos crecido hasta convertirnos en una de las redes de inspección vehicular
                      más grandes del país. Más de 10 años de experiencia y más de 700 000 atenciones respaldan
                      nuestra trayectoria, con el mismo rigor en una revisión breve que en una flota completa.
                    </p>
                    <p>
                      Además de los centros de inspección, operamos una red de academias de conductores y policlínicos
                      autorizados, de modo que un usuario pueda resolver en un solo lugar la revisión vehicular, el
                      examen médico y la formación que necesita para mantener su licencia vigente.
                    </p>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll className="delay-200">
                  <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    {[
                      {
                        icon: Cpu,
                        title: 'Tecnología de punta',
                        desc: 'Líneas calibradas y digitalización completa del proceso.'
                      },
                      {
                        icon: Wrench,
                        title: 'Manos expertas',
                        desc: 'Técnicos formados en cada sistema de suspensión y frenado.'
                      },
                      {
                        icon: ClipboardCheck,
                        title: 'Trazabilidad total',
                        desc: 'Cada resultado queda registrado y disponible para consulta.'
                      },
                      {
                        icon: Users,
                        title: 'Atención humana',
                        desc: 'Explicamos cada observación para que salgas con dudas resueltas.'
                      }
                    ].map(({ icon: Icon, title, desc }) => (
                      <li key={title} className="flex gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition-colors duration-300">
                          <Icon size={22} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-bold text-gray-900">{title}</span>
                          <span className="mt-1 block text-xs leading-relaxed text-gray-500">{desc}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </RevealOnScroll>
              </div>

              {/* Visual */}
              <div className="lg:col-span-5">
                <RevealOnScroll className="delay-100">
                  <div className="group relative">
                    <div className="overflow-hidden rounded-[32px] shadow-xl">
                      <img
                        src={
                          FOTO_QUIENES ??
                          'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80'
                        }
                        alt="Instalaciones de una de nuestras sedes de revisión técnica"
                        className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105 lg:h-[26rem]"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="absolute inset-x-6 -bottom-6 rounded-2xl border border-gray-100 bg-white/95 p-5 shadow-2xl backdrop-blur">
                      <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                          <Award size={24} />
                        </span>
                        <p className="text-xs font-bold uppercase leading-relaxed tracking-wider text-gray-600">
                          Proceso estandarizado y{' '}
                          <strong className="text-gray-900">resultados auditables</strong> en cada sede
                        </p>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* 3. VISION / MISSION / VALUES GRID */}
        <section className="mx-auto max-w-7xl px-4 section">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Card: Vision */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col md:flex-row p-8 gap-8 group">
              <div className="flex-1 space-y-6">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                  <Eye size={30} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 leading-tight">Nuestra Visión</h3>
                <p className="content-text text-gray-500">
                  Ser la empresa líder en revisiones técnicas vehiculares en el Perú, reconocida por nuestra
                  excelencia en el servicio, compromiso con la seguridad vial y aporte a la preservación del medio
                  ambiente. Aspiramos a estar cada vez más cerca de nuestros clientes, expandiendo nuestra cobertura y
                  consolidándonos como el principal referente en la certificación técnica vehicular.
                </p>
              </div>
              <div className="flex-1 rounded-xl overflow-hidden h-48 md:h-auto">
                <img
                  src={
                    FOTO_VISION ??
                    'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                  }
                  alt="Nuestra red de sedes de revisión técnica"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Card: Stats (Orange) */}
            <div className="bg-orange-500 rounded-2xl p-8 flex flex-col justify-center items-center text-center text-white shadow-xl shadow-orange-500/20 group">
              <h4 className="stat-num text-4xl md:text-5xl font-black mb-2 tracking-tighter">
                <Counter end={700000} suffix="+" format />
              </h4>
              <p className="text-xs uppercase tracking-[0.2em] font-bold opacity-80 mb-6">Atenciones realizadas</p>
              <p className="text-sm font-medium opacity-90 border-t border-white/20 pt-6">
                Respaldadas por más de 10 años de experiencia en seguridad vial.
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
                  Contribuir a la seguridad vial en el Perú mediante un servicio de revisiones técnicas vehiculares
                  que garantice el buen estado y funcionamiento de los vehículos. Trabajamos para reducir los
                  accidentes de tránsito y minimizar la contaminación ambiental, asegurando que cada unidad cumpla con
                  los estándares técnicos establecidos por la normativa nacional. Nuestro compromiso es ofrecer un
                  servicio eficiente, confiable y accesible, promoviendo una movilidad más segura y sostenible.
                </p>
              </div>
              <div className="md:w-1/3 relative">
                <img
                  src={
                    FOTO_MISION ??
                    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                  }
                  alt="Vehículo siendo inspeccionado en una de nuestras sedes"
                  className="w-full h-full object-cover transition-opacity duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1a] via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* 4. TIMELINE SECTION (HITOS DE INNOVACIÓN) */}
        <section className="section relative overflow-hidden border-t border-gray-100 bg-gradient-to-b from-white to-gray-50">
          <div className="relative z-10 mx-auto max-w-5xl px-4">
            <RevealOnScroll className="mb-16 text-center">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-orange-500">TRAYECTORIA</p>
              <h2 className="mb-4 text-4xl font-black tracking-tight text-gray-900 md:text-5xl">Hitos de Innovación</h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-500 md:text-xl">
                Más de una década transformando la seguridad vial a través de la excelencia técnica.
              </p>
            </RevealOnScroll>

            {/*
              El trazo vive dentro del contenedor de la lista, no en el `section`:
              así sus extremos coinciden exactamente con el primer y el último
              punto, y en móvil queda pegado al margen izquierdo (left-6) en vez
              de cruzar por medio del texto.
            */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-6 w-0.5 -translate-x-1/2 bg-orange-200 lg:hidden"
              />
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-1/2 hidden w-1 -translate-x-1/2 bg-gradient-to-b from-orange-200 via-orange-400 to-orange-600 lg:block"
              />

              <ol className="space-y-16 lg:space-y-24">
                {HITOS.map((hito, i) => (
                  <li key={hito.year}>
                    <RevealOnScroll className={`delay-${(i % 3) * 100}`}>
                      <MilestoneCard hito={hito} index={i} />
                    </RevealOnScroll>
                  </li>
                ))}
              </ol>
            </div>

            {/* Cierre del recorrido: mismo bloque para móvil y escritorio. */}
            <RevealOnScroll className="mt-16 flex justify-center lg:mt-20">
              <div className="inline-flex items-center gap-3 rounded-full border-2 border-orange-400 bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-3 shadow-2xl lg:px-8 lg:py-4">
                <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-200 lg:h-6 lg:w-6">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500 lg:h-3 lg:w-3" />
                </span>
                <span className="text-sm font-bold text-white lg:text-lg">META: Excelencia Continua</span>
                <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-200 lg:h-6 lg:w-6">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500 lg:h-3 lg:w-3" />
                </span>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* 5. CONVENIOS Y PLANES EMPRESARIALES */}
        <section className="max-w-7xl mx-auto px-4 section border-t border-gray-100">
          <div className="text-center mb-12">
            <p className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4">SOLUCIONES B2B</p>
            <h2 className="text-5xl font-bold text-gray-900 tracking-tight mb-6">Planes para cada <span className="text-orange-500">Necesidad</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium text-lg">Ofrecemos programas integrales de revisión técnica diseñados para optimizar la gestión de su flota vehicular.</p>
          </div>

          {/* Carrusel: 1 card en móvil, 2 en tablet, 3 en desktop. Scrollbar oculta, puntos indicadores. */}
          <div className="relative">
            <div
              ref={plansTrackRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 -mx-4 px-4 scrollbar-hide"
              onScroll={(event) => syncPlanIndex(event.currentTarget)}
            >
              {PLANES.map((plan, i) => {
                const Icon = PLAN_ICON[plan.id];
                return (
                  <RevealOnScroll key={plan.id} className={`delay-${(i % 3) * 100} ${PLAN_CARD_WIDTH}`}>
                    <div className="h-full bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col">
                      <div className="h-64 overflow-hidden relative">
                        <img
                          src={plan.imagen}
                          alt={plan.alt}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-6 left-6 p-4 bg-white/95 backdrop-blur rounded-2xl shadow-xl">
                          {Icon && <Icon className="text-orange-600 w-7 h-7" />}
                        </div>
                      </div>
                      <div className="p-10 flex flex-col">
                        <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">{plan.titulo}</h3>
                        <p className="text-gray-500 mb-8 leading-relaxed font-medium">{plan.resumen}</p>
                        <div className="space-y-4 mb-10">
                          {plan.destacado.map((item) => (
                            <div key={item} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                              <CheckCircle2 size={18} className="text-orange-500 shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                        <PremiumButton
                          onClick={() => setSelectedPlan(plan)}
                          className="mt-auto w-full py-4 text-sm uppercase tracking-widest bg-gray-50 !text-gray-900 hover:!text-white border-none shadow-none"
                        >
                          Saber más
                        </PremiumButton>
                      </div>
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>

            {/* Puntos indicadores (solo movil/tablet) */}
            <div className="flex justify-center gap-2 mt-4 md:hidden">
              {PLANES.map((plan, i) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => goToPlan(i)}
                  aria-label={`Ir al plan ${plan.titulo}`}
                  aria-current={planIndex === i}
                  className={`h-2 transition-all duration-300 ${planIndex === i ? 'w-8 bg-[#f97316]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    } rounded-full`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 6. SERVICIOS COMPLEMENTARIOS (ESCUELA / POLICLINICOS) */}
        <section className="bg-gray-50 section border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-4">MÁS QUE REVISIONES</p>
              <h2 className="text-5xl font-bold text-gray-900 tracking-tight mb-6">Servicios <span className="text-orange-500">Complementarios</span></h2>
              <p className="text-gray-500 max-w-2xl mx-auto font-medium text-lg">Nuestra red de excelencia incluye formación especializada y servicios médicos certificados.</p>
            </div>

            {/* Al abrir una tarjeta la rejilla pasa a una sola columna para que el
                panel desplegado tenga el ancho completo; al cerrar vuelve al
                comparativo de dos columnas. */}
            <div
              className={`grid items-start gap-8 transition-[grid-template-columns] duration-500 ease-out ${showEscuela || showPoliclinicos ? 'grid-cols-1' : 'md:grid-cols-2'
                }`}
            >
              {COMPLEMENTARIOS.map((servicio, i) => (
                <RevealOnScroll key={servicio.id} className={i === 1 ? 'delay-200' : ''}>
                  <ComplementarioCard
                    {...servicio}
                    abierto={servicio.tipo === 'escuela' ? showEscuela : showPoliclinicos}
                    onSelectBranch={openBranchModal}
                    onToggle={() => {
                      if (servicio.tipo === 'escuela') {
                        setShowEscuela(!showEscuela);
                        if (!showEscuela) setShowPoliclinicos(false);
                      } else {
                        setShowPoliclinicos(!showPoliclinicos);
                        if (!showPoliclinicos) setShowEscuela(false);
                      }
                    }}
                  />
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>


        {/* Popup de detalle del plan B2B: en lugar de navegar a /contacto, muestra la
            información completa y ofrece cerrar o escribirnos por WhatsApp. */}
        {selectedPlan &&
          ReactDOM.createPortal(
            <>
              <div className="modal-overlay overscroll-contain" onClick={closePlanModal} />
              <div className="modal-container">
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="plan-modal-title"
                  className="modal-content w-full max-w-3xl overflow-y-auto overscroll-contain rounded-[32px] bg-white shadow-2xl animate-entry-slide-down"
                  style={{ maxHeight: '90vh' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Cabecera con imagen */}
                  <div className="relative h-44 overflow-hidden sm:h-56">
                    <img src={selectedPlan.imagen} alt={selectedPlan.alt} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />
                    <button
                      type="button"
                      onClick={closePlanModal}
                      aria-label="Cerrar"
                      className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white hover:text-gray-900"
                    >
                      <X size={20} />
                    </button>
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">
                        Solución B2B
                      </p>
                      <h3
                        id="plan-modal-title"
                        className="pr-12 text-2xl font-black uppercase leading-tight tracking-tight text-white sm:text-4xl"
                      >
                        {selectedPlan.titulo}
                      </h3>
                    </div>
                  </div>

                  {/* Cuerpo con scroll propio para que el pie quede siempre visible */}
                  <div className="max-h-[45vh] overflow-y-auto p-6 sm:p-8">
                    <p className="content-text mb-8 text-gray-600">{selectedPlan.detalle}</p>

                    <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                      Qué incluye
                    </p>
                    <ul className="space-y-3">
                      {selectedPlan.incluye.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm font-medium text-gray-700">
                          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-orange-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="mt-8 flex items-start gap-3 rounded-2xl bg-orange-50 p-4 text-sm text-gray-700">
                      <Target size={18} className="mt-0.5 shrink-0 text-orange-600" />
                      <span>
                        <strong className="font-bold text-gray-900">Ideal para: </strong>
                        {selectedPlan.idealPara}
                      </span>
                    </p>
                  </div>

                  {/* Pie: cerrar o contactar por este plan en concreto */}
                  <div className="grid grid-cols-1 gap-3 border-t border-gray-100 bg-gray-50 p-6 sm:grid-cols-2 sm:p-8">
                    <button
                      type="button"
                      onClick={closePlanModal}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-4 text-xs font-black uppercase tracking-widest text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900"
                    >
                      <X size={16} />
                      Cerrar
                    </button>
                    <button
                      type="button"
                      onClick={() => contactarPlan(selectedPlan)}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-green-500 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-green-500/20 transition-colors hover:bg-green-600 active:scale-95"
                    >
                      <FaWhatsapp size={18} />
                      Contactar
                    </button>
                  </div>
                </div>
              </div>
            </>,
            document.body
          )}

        {/* Modal Popup para información de sucursal - Usando Portal para asegurar centrado */}
        {selectedBranch && ReactDOM.createPortal(
          <>
            <div className="modal-overlay overscroll-contain" onClick={closeBranchModal} />
            <div className="modal-container">
              <div className="modal-content bg-white rounded-[40px] max-w-4xl w-full shadow-2xl overflow-y-auto overscroll-contain animate-entry-slide-down" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col md:flex-row overflow-y-auto md:overflow-hidden overscroll-contain" style={{ maxHeight: '90vh' }}>
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

