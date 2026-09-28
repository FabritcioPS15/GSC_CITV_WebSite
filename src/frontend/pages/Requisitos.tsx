import { useState } from 'react';
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
    FaTools
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import PremiumButton from '../components/PremiumButton';

function Requisitos() {
    const [activeStep, setActiveStep] = useState<number | null>(null);

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

    // Steps for the Zig-Zag Roadmap
    const steps = [
        {
            id: 1,
            title: "Ingreso de Vehículos",
            desc: "Llegada a la planta e indicaciones iniciales.",
            icon: <FaCarSide className="text-white text-xl" />,
            color: "bg-orange-500"
        },
        {
            id: 2,
            title: "Entrega de Documentos y Pago",
            desc: "Revisión de SOAT, TIV y pago del servicio.",
            icon: <FaMoneyBillWave className="text-white text-xl" />,
            color: "bg-gray-800"
        },
        {
            id: 3,
            title: "Estación de Emisiones",
            desc: "Análisis de gases (gasolina/GLP/GNV) y opacidad (diesel).",
            icon: <FaGasPump className="text-white text-xl" />,
            color: "bg-gray-800"
        },
        {
            id: 4,
            title: "Estación de Suspensión",
            desc: "Prueba de eficiencia de la suspensión por eje.",
            icon: <FaCar className="text-white text-xl" />,
            color: "bg-gray-800"
        },
        {
            id: 5,
            title: "Estación de Luces",
            desc: "Verificación de alineamiento e intensidad de faros.",
            icon: <FaLightbulb className="text-white text-xl" />,
            color: "bg-gray-800"
        },
        {
            id: 6,
            title: "Estación Visual",
            desc: "Inspección de chasis, carrocería, neumáticos y vidrios.",
            icon: <FaEye className="text-white text-xl" />,
            color: "bg-gray-800"
        },
        {
            id: 7,
            title: "Frenos y Alineamiento",
            desc: "Prueba de frenometría y desviacin lateral.",
            icon: <FaTools className="text-white text-xl" />,
            color: "bg-gray-800"
        },
        {
            id: 8,
            title: "Entrega de Resultados",
            desc: "Emisión y entrega del Certificado de Inspección Técnica.",
            icon: <FaClipboardList className="text-white text-xl" />,
            color: "bg-orange-500"
        }
    ];

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
                            <div className="space-y-6">
                                {generalRequirements.map((req, index) => (
                                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-all">
                                        <div className="bg-orange-50 p-3 rounded-lg flex-shrink-0">
                                            {req.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">{req.title}</h3>
                                            <p className="content-text text-gray-600">{req.description}</p>
                                        </div>
                                    </div>
                                ))}
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
                            <div className="space-y-6">
                                {specificRequirements.map((req, index) => (
                                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-all">
                                        <div className="bg-orange-50 p-3 rounded-lg flex-shrink-0">
                                            {req.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1">{req.title}</h3>
                                            <p className="content-text text-gray-600">{req.description}</p>
                                        </div>
                                    </div>
                                ))}
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

                        <div className="relative max-w-5xl mx-auto">
                            {/* Road Background - Desktop (ZigZag) */}
                            <div className="hidden md:block absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
                                <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
                                    {/* Path coordinates simulated for 4 rows of 2 items or a snake flow */}
                                    <path
                                        d="M 120,80 L 880,80 L 880,240 L 120,240 L 120,400 L 880,400"
                                        fill="none"
                                        stroke="#e5e7eb"
                                        strokeWidth="40"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M 120,80 L 880,80 L 880,240 L 120,240 L 120,400 L 880,400"
                                        fill="none"
                                        stroke="#9ca3af"
                                        strokeWidth="4"
                                        strokeDasharray="20,20"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                            {/* Mobile Road: Simple vertical line */}
                            <div className="md:hidden absolute top-0 left-8 bottom-0 w-2 bg-gray-200 -z-10 rounded-full"></div>

                            {/* Grid for Steps */}
                            {/* We map items to specific absolute positions visually in a relative container */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-y-12 md:gap-y-24 md:gap-x-8">
                                {steps.map((step, index) => {
                                    // Calculate visual positioning logic for Zig-Zag
                                    // Row 1: 0, 1, 2, 3 (Left to Right)
                                    // Row 2: 7, 6, 5, 4 (Right to Left) -> This is complicated for simple grid.
                                    // Let's use flex-order or just manual placement logic? 
                                    // Better approach: standard grid but styled to LOOK like a path.
                                    // Actually, for a TRUE zig zag, manual positioning or specific grid placement is best.

                                    // Let's try a simpler Approach:
                                    // A vertical list on mobile.
                                    // A snake on desktop using specific classes for each child.

                                    // Desktop Layout Logic:
                                    // Row 1: Steps 1, 2, 3, 4
                                    // Row 2: Steps 8, 7, 6, 5 (Reverse order visually)

                                    // BUT, a real road map usually goes 1 -> 2
                                    //                                     |
                                    //                                     3 -> 4 etc.
                                    // The image provided has a winding road.

                                    // Let's stick to a clean 2-row grid for simplicity but visually connected.
                                    // Actually, let's do a 4-col grid.
                                    // Row 1: 1, 2, 3, 4
                                    // Row 2: 8, 7, 6, 5 (We need to render them in this visual order for the grid, but logically they are steps)

                                    // To avoid DOM order confusion, let's keep DOM order 1-8 but use CSS Grid areas or flex-direction?
                                    // No, simpler: Render the list, but style distinct rows.

                                    // Simplified visual: Just a straight horizontal line 1-4, then 5-8?
                                    // The prompt asked for "INTERACTIVE" and "LIKE THE IMAGE". The image is a winding road.

                                    return (
                                        <div
                                            key={step.id}
                                            className={`
                          relative group
                          md:col-span-1
                          flex md:flex-col items-center
                          ${index >= 4 ? 'md:flex-col-reverse' : ''} 
                          /* On desktop, items 5,6,7,8 needs to be reversed in the grid row? No, just visual flow. */
                        `}
                                            onMouseEnter={() => setActiveStep(step.id)}
                                            onMouseLeave={() => setActiveStep(null)}
                                        >
                                            {/* Connector Lines for Mobile */}
                                            {index < steps.length - 1 && (
                                                <div className="md:hidden absolute left-8 top-16 bottom-[-3rem] w-0.5 border-l-2 border-dashed border-gray-300"></div>
                                            )}

                                            {/* Node circle */}
                                            <div className={`
                            w-16 h-16 rounded-full flex items-center justify-center 
                            shadow-lg z-10 transition-transform duration-300 group-hover:scale-110
                            ${activeStep === step.id ? 'scale-110 ring-4 ring-orange-200' : ''}
                            ${step.color}
                         `}>
                                                {step.icon}
                                            </div>

                                            {/* Number Badge */}
                                            <div className="absolute top-0 left-0 md:left-1/2 md:-ml-10 bg-white border-2 border-gray-900 text-gray-900 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center z-20">
                                                {step.id}
                                            </div>

                                            {/* Text Content */}
                                            <div className={`
                            ml-6 md:ml-0 md:text-center p-4 bg-white md:bg-transparent rounded-xl md:rounded-none shadow-sm md:shadow-none border md:border-none border-gray-100
                            ${index >= 4 ? 'md:mb-4' : 'md:mt-4'}
                            transition-all duration-300
                            ${activeStep === step.id ? 'md:-translate-y-2' : ''}
                         `}>
                                                <h3 className={`font-bold text-lg mb-1 group-hover:text-orange-600 transition-colors`}>{step.title}</h3>
                                                <p className="content-text text-gray-600 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-0 right-0 -bottom-16 md:bottom-auto bg-white p-3 rounded-lg shadow-xl z-50 border border-gray-200 w-48 mx-auto">
                                                    {step.desc}
                                                </p>
                                                {/* Mobile desc always visible */}
                                                <p className="content-text text-gray-600 md:hidden mt-1">{step.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Decorative Path for Desktop (Simplified SVG Overlay) */}
                            {/* We'll use a CSS approach to connect them if SVG is too complex for specific responsiveness */}
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

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 transition-all hover:border-gray-300 hover:shadow-sm">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-start gap-3">
                                        <span className="text-orange-500 mt-1 text-sm">•</span>
                                        {faq.q}
                                    </h3>
                                    <p className="content-text text-gray-600 pl-6">
                                        {faq.a}
                                    </p>
                                </div>
                            ))}
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
