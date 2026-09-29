import { useState, useEffect, useRef } from 'react';
import RevealOnScroll from '../components/RevealOnScroll';
import {
    FaIdCard,
    FaFileContract,
    FaGasPump,
    FaBus,
    FaCar,
    FaQuestionCircle,
    FaClipboardList,
    FaCarSide,
    FaMoneyBillWave,
    FaLightbulb,
    FaEye,
    FaTools,
    FaCheckCircle,
    FaClock,
    FaPlay,
    FaPause
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import PremiumButton from '../components/PremiumButton';

function Requisitos() {
    const [activeStep, setActiveStep] = useState<number>(1);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [openSpecific, setOpenSpecific] = useState<number | null>(null);
    const [openGeneral, setOpenGeneral] = useState<number | null>(null);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const trackRef = useRef<HTMLDivElement | null>(null);
    const [carOffset, setCarOffset] = useState<number | null>(null);
    const [rail, setRail] = useState<{ start: number; end: number } | null>(null);

    const generalRequirements = [
        {
            title: "Tarjeta de Propiedad",
            description: "Tarjeta de Identificación Vehicular (TIV) física o electrónica.",
            icon: <FaIdCard className="text-3xl text-orange-600" />
        },
        {
            title: "SOAT Vigente",
            description: "Seguro Obligatorio de Accidentes de Tránsito activo (físico o digital).",
            icon: <FaFileContract className="text-3xl text-orange-600" />
        },
        {
            title: "Revisión Anterior",
            description: "Si el vehículo ya pasó revisión antes, presentar el certificado anterior (vencido o por vencer).",
            icon: <FaClipboardList className="text-3xl text-orange-600" />
        }
    ];

    const specificRequirements = [
        {
            title: "Vehículos a Gas (GNV/GLP)",
            description: "Certificado de conformidad de conversión vigente y certificado de inspección anual (si aplica).",
            icon: <FaGasPump className="text-3xl text-orange-500" />
        },
        {
            title: "Lunas Polarizadas",
            description: "Si el vehículo cuenta con lunas polarizadas, presentar el permiso vigente correspondiente.",
            icon: <FaCar className="text-3xl text-orange-500" />
        },
        {
            title: "Transporte Público / Carga",
            description: "Tarjeta de Circulación y habilitación vehicular vigente (MTC o Municipalidad).",
            icon: <FaBus className="text-3xl text-orange-500" />
        }
    ];

    // Steps for the interactive inspection process timeline
    const steps = [
        {
            id: 1,
            car: '/carro.png',
            image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            title: "Ingreso de Vehículos",
            desc: "Recepción del vehículo en planta, registro de la placa y asignación del carril de inspección según el tipo de servicio.",
            checks: [
                "Registro de placa y orden de llegada",
                "Verificación de identidad del conductor",
                "Asignación de carril por tipo de servicio"
            ],
            duration: "5 a 10 min",
            tip: "Llega 20 minutos antes para evitar filas en horas pico.",
            icon: <FaCarSide className="text-white text-xl" />
        },
        {
            id: 2,
            car: '/carro.png',
            image: 'https://images.unsplash.com/photo-1583911860205-72f8ac8ddc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            title: "Entrega de Documentos y Pago",
            desc: "Recepción y validación de la documentación exigida por el MTC, seguida del pago del servicio de inspección.",
            checks: [
                "Tarjeta de propiedad (TIV) física o electrónica",
                "SOAT vigente",
                "Pago del servicio en ventanilla"
            ],
            duration: "5 a 10 min",
            tip: "Si presentas la revisión anterior vencida, no necesitarás el Citizen.",
            icon: <FaMoneyBillWave className="text-white text-xl" />
        },
        {
            id: 3,
            car: '/carro.png',
            image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            title: "Estación de Emisiones",
            desc: "Análisis de los gases de escape y verificación del nivel de opacidad en motores diésel, según el tipo de combustible del vehículo.",
            checks: [
                "Medición de gases en vehiculos a gasolina, GLP o GNV",
                "Nivel de opacidad en motores diésel",
                "Control de temperatura de gases"
            ],
            duration: "10 a 15 min",
            tip: "Un motor sin sobrecalentamiento ni gases sucios aprueba esta estación sin observaciones.",
            icon: <FaGasPump className="text-white text-xl" />
        },
        {
            id: 4,
            car: '/carro.png',
            image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            title: "Estación de Luces",
            desc: "Verificación de la intensidad y del correcto alineamiento de los faros, además del funcionamiento de todas las luces obligatorias.",
            checks: [
                "Intensidad y alineamiento de faros",
                "Luces bajas, altas y de posición",
                "Balizas, intermitentes y luces de freno",
                "Luz de marcha atrás"
            ],
            duration: "10 min",
            tip: "Los faros alineados evitan el clásico reproche por dazzling o intensidad insuficiente.",
            icon: <FaLightbulb className="text-white text-xl" />
        },
        {
            id: 5,
            car: '/carro.png',
            image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            title: "Estación de Suspensión",
            desc: "Prueba de eficiencia de la suspensión por cada eje, evaluando rebote, amortiguación y el estado de las juntas.",
            checks: [
                "Eficiencia de suspensión por eje",
                "Rebote y amortiguación",
                "Estado de juntas y espirales",
                "Alineación de ejes traseros"
            ],
            duration: "15 a 20 min",
            tip: "Revisar espirales y amortiguadores antes de la inspección evita observaciones.",
            icon: <FaCar className="text-white text-xl" />
        },
        {
            id: 6,
            car: '/carro.png',
            image: 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            title: "Frenos y Alineamiento",
            desc: "Prueba de frenometría en ambos ejes y medición de la desviación lateral de las ruedas para verificar el alineamiento.",
            checks: [
                "Frenometría en ejes delanteros y traseros",
                "Desequilibrio entre frenosde un eje y otro",
                "Desviación lateral de ruedas",
                "Profundidad del dibujo del neumático"
            ],
            duration: "20 a 25 min",
            tip: "Es la estación que más veces genera observaciones por frenos desiguales.",
            icon: <FaTools className="text-white text-xl" />
        },
        {
            id: 7,
            car: '/carro.png',
            image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            title: "Estación Visual",
            desc: "Inspección del chasis, carrocería, neumáticos y elementos de seguridad y visibilidad del vehículo.",
            checks: [
                "Chasis, carrocería y elementos",
                "Estado y presión de neumáticos",
                "Vidrios, espejos y parabrisas",
                "Líquidos, filtros y batería"
            ],
            duration: "15 a 20 min",
            tip: "Lleva el vehículo limpio: facilita la inspección y evita reproches por suciedad.",
            icon: <FaEye className="text-white text-xl" />
        },
        {
            id: 8,
            car: '/carro.png',
            image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            title: "Entrega de Resultados",
            desc: "Emisión y entrega del Certificado de Inspección Técnica, con el detalle de observaciones si las hubiera.",
            checks: [
                "Lectura del resultado en el sistema",
                "Emisión del certificado",
                "Detalle de observaciones o Conformidad"
            ],
            duration: "10 min",
            tip: "El certificado es válido en todo el territorio peruano.",
            icon: <FaClipboardList className="text-white text-xl" />
        }
    ];

    // El carro avanza solo por el proceso. Al tocar o hacer clic en una etapa
    // el carrusel se detiene y se queda en esa etapa hasta que el usuario lo
    // reanude a mano, para que pueda leerla con calma.
    useEffect(() => {
        if (isPaused) return;
        const id = setInterval(() => {
            setActiveStep((prev) => (prev >= steps.length ? 1 : prev + 1));
        }, 4000);
        return () => clearInterval(id);
    }, [isPaused, steps.length]);

    // En movil la pista es scrolleable: al cambiar de etapa hay que traerla
    // a la vista, si no el usuario ve un punto que ya no corresponde.
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        if (window.matchMedia('(min-width: 768px)').matches) return;
        const el = track.querySelector<HTMLElement>(`[data-step="${activeStep}"]`);
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, [activeStep]);

    // Mide el centro real de cada circulo en lugar de estimarlo con porcentajes.
    // Asi el carro y el riel nunca se recortan ni se desvian en la primera o
    // ultima etapa, y siguen alineados si la ventana cambia de ancho.
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const centerOf = (id: number) => {
            const el = track.querySelector<HTMLElement>(`[data-step="${id}"]`);
            return el ? el.offsetLeft + el.offsetWidth / 2 : null;
        };

        const update = () => {
            const center = centerOf(activeStep);
            const start = centerOf(1);
            const end = centerOf(steps.length);
            if (center === null || start === null || end === null) return;
            setCarOffset(center);
            setRail({ start, end });
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(track);
        window.addEventListener('resize', update);
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', update);
        };
    }, [activeStep, steps.length]);

    const faqs = [
        {
            q: "¿Cuándo me toca mi revisión técnica?",
            a: "Vehículos particulares: A partir del 4to año de fabricación. Vehículos de servicio: A partir del 3er año. La frecuencia posterior es anual (particulares) o semestral (servicio público)."
        },
        {
            q: "¿Qué pasa si no apruebo la inspección?",
            a: "Tienes un plazo (generalmente 30 a 60 días según el tipo de falta) para subsanar las observaciones y volver a pasar la revisión sin costo adicional (o costo reducido) en la misma planta."
        },
        {
            q: "¿La revisión es válida a nivel nacional?",
            a: "Sí, nuestros certificados son válidos en todo el territorio peruano y reconocidos por el MTC y SUTRAN."
        },
        {
            q: "¿Necesito sacar cita?",
            a: "No es obligatorio, atendemos por orden de llegada. Sin embargo, reservar una cita puede agilizar tu atención."
        }
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Standardized Left-Aligned Banner (Compact) */}
            <section className="page-banner">
                {/* Background Layer */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                        alt="Requisitos"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
                    <RevealOnScroll>
                        <div className="max-w-4xl flex items-center gap-8 group">
                            <div className="w-1.5 h-20 bg-orange-500 rounded-full shrink-0 animate-grow-vertical" />
                            <div className="space-y-4">
                                <h1 className="banner-title text-white animate-grow-text">
                                    Requisitos y <span className="text-orange-500">Proceso</span>
                                </h1>
                                <p className="banner-description text-gray-400 max-w-2xl">
                                    Guía completa paso a paso para aprobar tu inspección vehicular sin contratiempos y cumplir con la normativa vigente.
                                </p>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>

                {/* Bottom Decorative Detail */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-orange-500/0 to-transparent opacity-50" />
            </section>

            {/* Main Content */}
            <section className="max-w-7xl mx-auto px-4 py-16">

                {/* Requirements Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
                    {/* General Requirements */}
                    <RevealOnScroll>
                        <div>
                            <div className="border-l-4 border-orange-500 pl-4 mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">Requisitos Generales</h2>
                                <p className="text-gray-600 mt-1">Obligatorio para todos</p>
                            </div>
                            <div className="space-y-3">
                                {generalRequirements.map((req, index) => {
                                    const isOpen = openGeneral === index;
                                    return (
                                        <div
                                            key={index}
                                            className={`bg-white rounded-xl border transition-all duration-300 ${isOpen
                                                ? 'border-orange-400 shadow-md shadow-orange-500/5'
                                                : 'border-gray-100 hover:border-orange-300'
                                                }`}
                                        >
                                            <h3>
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenGeneral(isOpen ? null : index)}
                                                    aria-expanded={isOpen}
                                                    aria-controls={`gen-panel-${index}`}
                                                    className="w-full flex items-center justify-between gap-4 text-left p-5"
                                                >
                                                    <span className="flex items-center gap-4">
                                                        <span className="bg-orange-50 p-3 rounded-lg flex-shrink-0">
                                                            {req.icon}
                                                        </span>
                                                        <span className="font-bold text-gray-900">{req.title}</span>
                                                    </span>
                                                    <span
                                                        className={`shrink-0 w-7 h-7 border border-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-all duration-300 ${isOpen
                                                            ? 'rotate-45 bg-orange-500 border-orange-500 text-white'
                                                            : 'hover:border-orange-400 hover:text-orange-500'
                                                            }`}
                                                    >
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                                            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                                        </svg>
                                                    </span>
                                                </button>
                                            </h3>

                                            <div
                                                id={`gen-panel-${index}`}
                                                role="region"
                                                className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                                    }`}
                                            >
                                                <div className="overflow-hidden">
                                                    <p className="content-text text-gray-600 pl-[4.5rem] pr-5 pb-5">
                                                        {req.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </RevealOnScroll>

                    {/* Specific Requirements */}
                    <RevealOnScroll>
                        <div>
                            <div className="border-l-4 border-orange-500 pl-4 mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">Requisitos Específicos</h2>
                                <p className="text-gray-600 mt-1">Según tipo de vehículo</p>
                            </div>
                            <div className="space-y-3">
                                {specificRequirements.map((req, index) => {
                                    const isOpen = openSpecific === index;
                                    return (
                                        <div
                                            key={index}
                                            className={`bg-white rounded-xl border transition-all duration-300 ${isOpen
                                                ? 'border-orange-400 shadow-md shadow-orange-500/5'
                                                : 'border-gray-100 hover:border-orange-300'
                                                }`}
                                        >
                                            <h3>
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenSpecific(isOpen ? null : index)}
                                                    aria-expanded={isOpen}
                                                    aria-controls={`req-panel-${index}`}
                                                    className="w-full flex items-center justify-between gap-4 text-left p-5"
                                                >
                                                    <span className="flex items-center gap-4">
                                                        <span className="bg-orange-50 p-3 rounded-lg flex-shrink-0">
                                                            {req.icon}
                                                        </span>
                                                        <span className="font-bold text-gray-900">{req.title}</span>
                                                    </span>
                                                    <span
                                                        className={`shrink-0 w-7 h-7 border border-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-all duration-300 ${isOpen
                                                            ? 'rotate-45 bg-orange-500 border-orange-500 text-white'
                                                            : 'hover:border-orange-400 hover:text-orange-500'
                                                            }`}
                                                    >
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                                            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                                        </svg>
                                                    </span>
                                                </button>
                                            </h3>

                                            <div
                                                id={`req-panel-${index}`}
                                                role="region"
                                                className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                                    }`}
                                            >
                                                <div className="overflow-hidden">
                                                    <p className="content-text text-gray-600 pl-[4.5rem] pr-5 pb-5">
                                                        {req.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>

                {/* INTERACTIVE PROCESS MAP */}
                <RevealOnScroll>
                    <div className="">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
                            Proceso de Inspección <span className="text-orange-600">Paso a Paso</span>
                        </h2>

                        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
                            El carro avanza solo por cada etapa del proceso. Toca una etapa para detenerlo y leerla con calma.
                        </p>

                        {/* Timeline interactivo con carro en movimiento */}
                        <div className="max-w-6xl mx-auto px-3 md:px-14">
                            <div className="relative">
                                {/* Riel de progreso: arrancan y terminan en el centro
                                        del primer y ultimo circulo, nunca en el borde. */}
                                {rail && (
                                    <>
                                        <div
                                            className="hidden md:block absolute top-[7.75rem] h-1 bg-gray-200 rounded-full"
                                            style={{ left: rail.start, width: rail.end - rail.start }}
                                        />
                                        <div
                                            className="hidden md:block absolute top-[7.75rem] h-1 bg-orange-500 rounded-full transition-all duration-500 ease-out"
                                            style={{
                                                left: rail.start,
                                                width: Math.max(0, (carOffset ?? rail.start) - rail.start)
                                            }}
                                        />
                                    </>
                                )}

                                {/* Carro que avanza por el proceso */}
                                <div
                                    className="hidden md:block absolute top-[5.7rem] z-20 pointer-events-none transition-all duration-500 ease-out"
                                    style={{
                                        left: carOffset ?? 0,
                                        transform: 'translateX(-50%)'
                                    }}
                                >
                                    <img
                                        src={steps[activeStep - 1]?.car ?? '/carro.png'}
                                        alt=""
                                        aria-hidden="true"
                                        className="w-20 sm:w-24 drop-shadow-md"
                                    />
                                </div>

                                <div
                                    ref={trackRef}
                                    className="relative flex overflow-x-auto pt-3 pb-4 md:pt-24 scrollbar-hide"
                                    onMouseEnter={() => setIsPaused(true)}
                                    onMouseLeave={() => setIsPaused(false)}
                                >
                                    {steps.map((step) => {
                                        const isActive = activeStep === step.id;
                                        const isPast = step.id < activeStep;
                                        return (
                                            <button
                                                key={step.id}
                                                type="button"
                                                data-step={step.id}
                                                onMouseEnter={() => { setIsPaused(true); setActiveStep(step.id); }}
                                                onFocus={() => { setIsPaused(true); setActiveStep(step.id); }}
                                                onClick={() => { setIsPaused(true); setActiveStep(step.id); }}
                                                aria-pressed={isActive}
                                                className="group relative flex-1 min-w-[88px] px-1.5 py-2 flex flex-col items-center gap-2.5 text-center focus:outline-none"
                                            >
                                                <span
                                                    className={`relative z-10 w-14 h-14 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                                                        ? 'bg-orange-500 scale-110 ring-4 ring-orange-200 shadow-lg shadow-orange-500/30'
                                                        : isPast
                                                            ? 'bg-gray-800'
                                                            : 'bg-gray-300 group-hover:bg-gray-700'
                                                        }`}
                                                >
                                                    {step.icon}
                                                </span>
                                                <span className="flex flex-col items-center gap-1.5">
                                                    <span
                                                        className={`text-[11px] font-black leading-none tabular-nums transition-colors ${isActive
                                                            ? 'text-orange-600'
                                                            : 'text-gray-300 group-hover:text-gray-400'
                                                            }`}
                                                    >
                                                        {String(step.id).padStart(2, '0')}
                                                    </span>
                                                    <span
                                                        className={`text-[11px] sm:text-xs font-bold leading-tight transition-colors ${isActive
                                                            ? 'text-orange-600'
                                                            : 'text-gray-500 group-hover:text-gray-900'
                                                            }`}
                                                    >
                                                        {step.title}
                                                    </span>
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>

                        {/* Cuadro de informacion del paso activo */}
                        <div className="mt-6 mb-16 md:mt-8 md:mb-24 lg:mb-32">
                            {(() => {
                                const step = steps.find((s) => s.id === activeStep) ?? steps[0];
                                return (
                                    <div
                                        key={step.id}
                                        className="bg-white border-2 border-gray-900 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-400"
                                    >
                                        <div className="flex flex-col lg:flex-row">
                                            <div className="lg:w-72 shrink-0 bg-gray-900 text-white p-5 md:p-7 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-5">
                                                        <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                                                            {step.icon}
                                                        </div>
                                                        <span className="text-4xl font-black text-white/25 leading-none">
                                                            {String(step.id).padStart(2, '0')}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsPaused((p) => !p)}
                                                            aria-label={isPaused ? 'Reanudar recorrido' : 'Pausar recorrido'}
                                                            title={isPaused ? 'Reanudar recorrido' : 'Pausar recorrido'}
                                                            className="ml-auto shrink-0 w-9 h-9 flex items-center justify-center rounded-full border border-white/25 text-white/70 transition-colors hover:border-orange-500 hover:bg-orange-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                                                        >
                                                            {isPaused ? <FaPlay className="text-xs" /> : <FaPause className="text-xs" />}
                                                        </button>
                                                    </div>
                                                    <h3 className="text-2xl font-black leading-tight">{step.title}</h3>
                                                </div>
                                                <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-white/60">
                                                    <FaClock className="text-orange-500" />
                                                    {step.duration}
                                                </div>
                                            </div>

                                            {/* Alto fijo en escritorio: cambiar de etapa no debe
                                                cambiar el tamaño del panel, así el carrusel
                                                automático no salta mientras avanza. */}
                                            <div className="flex-1 flex flex-col lg:flex-row lg:h-[24rem]">
                                                <div className="flex-1 p-5 md:p-7 lg:p-8 lg:overflow-y-auto">
                                                    <p className="content-text text-gray-600 mb-6">{step.desc}</p>

                                                    <p className="text-[11px] font-black uppercase tracking-widest text-orange-600 mb-3">
                                                        Que se revisa
                                                    </p>
                                                    <ul className="grid sm:grid-cols-2 gap-2 mb-6">
                                                        {step.checks.map((check) => (
                                                            <li
                                                                key={check}
                                                                className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-100 px-3 py-2"
                                                            >
                                                                <FaCheckCircle className="text-orange-500 mt-0.5 shrink-0" size={14} />
                                                                <span className="leading-snug">{check}</span>
                                                            </li>
                                                        ))}
                                                    </ul>

                                                    <div className="flex items-start gap-2 bg-orange-50 border-l-2 border-orange-500 px-4 py-3">
                                                        <FaLightbulb className="text-orange-600 mt-0.5 shrink-0" size={15} />
                                                        <p className="text-[13px] text-orange-900 leading-relaxed">
                                                            <strong className="font-bold">Consejo:</strong> {step.tip}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="relative lg:w-64 shrink-0 min-h-[200px] lg:min-h-0 order-first lg:order-last">
                                                    <img
                                                        src={step.image}
                                                        alt={step.title}
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
                                                    <div className="absolute bottom-0 left-0 right-0 p-5">
                                                        <span className="inline-block bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1">
                                                            Etapa {String(step.id).padStart(2, '0')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </RevealOnScroll>

                {/* FAQs */}
                <RevealOnScroll>
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
                            <FaQuestionCircle className="text-orange-500" />
                            Preguntas Frecuentes
                        </h2>

                        <div className="space-y-3">
                            {faqs.map((faq, index) => {
                                const isOpen = openFaq === index;
                                return (
                                    <div
                                        key={index}
                                        className={`bg-white border rounded-xl transition-all duration-300 ${isOpen
                                            ? 'border-orange-400 shadow-md shadow-orange-500/5'
                                            : 'border-gray-200 hover:border-orange-300'
                                            }`}
                                    >
                                        <h3>
                                            <button
                                                type="button"
                                                onClick={() => setOpenFaq(isOpen ? null : index)}
                                                aria-expanded={isOpen}
                                                aria-controls={`faq-panel-${index}`}
                                                className="w-full flex items-start justify-between gap-4 text-left p-5 sm:p-6"
                                            >
                                                <span className="font-bold text-base sm:text-lg text-gray-900 flex items-start gap-3">
                                                    <span className={`text-orange-500 mt-1 text-sm transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
                                                        &#9656;
                                                    </span>
                                                    {faq.q}
                                                </span>
                                                <span
                                                    className={`shrink-0 w-7 h-7 border border-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-all duration-300 ${isOpen
                                                        ? 'rotate-45 bg-orange-500 border-orange-500 text-white'
                                                        : 'hover:border-orange-400 hover:text-orange-500'
                                                        }`}
                                                >
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                                        <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                                    </svg>
                                                </span>
                                            </button>
                                        </h3>

                                        <div
                                            id={`faq-panel-${index}`}
                                            role="region"
                                            className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                                }`}
                                        >
                                            <div className="overflow-hidden">
                                                <p className="content-text text-gray-600 pl-5 sm:pl-[3.1rem] pr-5 sm:pr-6 pb-5 sm:pb-6">
                                                    {faq.a}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-12 text-center">
                            <p className="text-gray-500 mb-6">¿Aún tienes dudas sobre los requisitos?</p>
                            <PremiumButton
                                to="/contacto"
                                className="px-8 py-3 bg-black text-white hover:bg-gray-800"
                            >
                                Contactar con un Asesor
                            </PremiumButton>
                        </div>
                    </div>
                </RevealOnScroll>

            </section>
        </div>
    );
}

export default Requisitos;
