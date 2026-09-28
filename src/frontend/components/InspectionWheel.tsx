import React, { useMemo } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';

interface WheelSegment {
    month: string;
    digit: string;
    isCurrent?: boolean;
}

const segments: WheelSegment[] = [
    { month: 'ENE - FEB', digit: '0' },
    { month: 'MAR', digit: '1' },
    { month: 'ABR', digit: '2' },
    { month: 'MAY', digit: '3' },
    { month: 'JUN', digit: '4' },
    { month: 'JUL - AGO', digit: '5' },
    { month: 'SEP', digit: '6' },
    { month: 'OCT', digit: '7' },
    { month: 'NOV', digit: '8' },
    { month: 'DIC', digit: '9' },
];

const InspectionWheel: React.FC = () => {
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

    // Mapping 12 months to 10 segments
    const currentMonthIndex = useMemo(() => {
        const month = new Date().getMonth();
        if (month <= 1) return 0; // Ene-Feb
        if (month <= 5) return month - 1; // Mar-Jun
        if (month <= 7) return 5; // Jul-Ago
        return month - 2; // Sep-Dic
    }, []);

    const renderSegments = useMemo(() => {
        const radius = 180;
        const centerX = 200;
        const centerY = 200;
        const segmentAngle = 360 / segments.length;

        return segments.map((seg, i) => {
            const startAngle = i * segmentAngle - 90;
            const endAngle = (i + 1) * segmentAngle - 90;

            const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
            const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
            const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
            const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

            const largeArcFlag = segmentAngle > 180 ? 1 : 0;
            const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            const textAngle = startAngle + segmentAngle / 2;
            const textRadiusMonth = radius * 0.82;
            const textRadiusDigit = radius * 0.6;

            const txMonth = centerX + textRadiusMonth * Math.cos((textAngle * Math.PI) / 180);
            const tyMonth = centerY + textRadiusMonth * Math.sin((textAngle * Math.PI) / 180);

            const txDigit = centerX + textRadiusDigit * Math.cos((textAngle * Math.PI) / 180);
            const tyDigit = centerY + textRadiusDigit * Math.sin((textAngle * Math.PI) / 180);

            const isCurrentMonth = i === currentMonthIndex;

            const isHovered = i === hoveredIndex;

            return (
                <g
                    key={i}
                    className="group/segment cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{
                        transformOrigin: '200px 200px',
                        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                >
                    <path
                        d={pathData}
                        fill={isCurrentMonth ? "url(#activeSegGrad)" : (isHovered ? "url(#hoverSegGrad)" : "url(#inactiveSegGrad)")}
                        stroke={isCurrentMonth ? "#ffffff" : "#e2e8f0"}
                        strokeWidth={isCurrentMonth ? "3" : "1.5"}
                        className="transition-all duration-500"
                        style={{
                            filter: isCurrentMonth ? 'drop-shadow(0 8px 16px rgba(249, 115, 22, 0.35))' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.01))'
                        }}
                    />
                    <text
                        x={txMonth}
                        y={tyMonth}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textAngle + 90}, ${txMonth}, ${tyMonth})`}
                        className={`text-[9px] font-extrabold tracking-widest ${isCurrentMonth ? 'fill-white' : 'fill-gray-400 group-hover/segment:fill-orange-600'
                            } transition-colors duration-300`}
                    >
                        {seg.month}
                    </text>
                    <text
                        x={txDigit}
                        y={tyDigit}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className={`text-2xl font-black ${isCurrentMonth ? 'fill-white' : 'fill-gray-900 group-hover/segment:fill-orange-600'
                            } transition-colors duration-300`}
                    >
                        {seg.digit}
                    </text>
                </g>
            );
        });
    }, [currentMonthIndex, hoveredIndex]);

    return (
        <section className="section bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">

                    {/* Left Content */}
                    <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
                        <RevealOnScroll>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-1.5 h-16 bg-orange-500 rounded-full" />
                                    <h2 className="text-4xl font-black text-gray-900 leading-tight uppercase tracking-tighter">
                                        Rueda de <br />
                                        <span className="text-orange-500">Inspecciones</span>
                                    </h2>
                                </div>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    Programa tu Inspección Técnica Vehicular de acuerdo al último dígito de tu placa.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Identifica el mes según tu dígito",
                                        "Agenda tu cita con anticipación",
                                        "Evita multas y recargos"
                                    ].map((text, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                            {text}
                                        </li>
                                    ))}
                                </ul>

                                <div className="pt-8 border-t border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Requisitos:</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                            <CheckCircle2 size={14} className="text-orange-500" />
                                            Tarjeta Propiedad
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                            <CheckCircle2 size={14} className="text-orange-500" />
                                            DNI / RUC
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                            <CheckCircle2 size={14} className="text-orange-500" />
                                            SOAT Vigente
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>

                    {/* Middle Wheel */}
                    <div className="lg:col-span-8 relative flex items-center justify-center order-1 lg:order-2">
                        <RevealOnScroll className="relative w-full aspect-square max-w-[650px]">
                            {/* Background decoration elements */}
                            <div className="absolute inset-0 bg-orange-500/5 rounded-full blur-3xl scale-110 animate-pulse" />

                            {/* The Wheel */}
                            <svg
                                viewBox="0 0 400 400"
                                className="w-full h-full drop-shadow-2xl relative z-10"
                            >
                                <defs>
                                    {/* Gradient for active segment */}
                                    <linearGradient id="activeSegGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#ff9f43" />
                                        <stop offset="100%" stopColor="#ff5e00" />
                                    </linearGradient>

                                    {/* Gradient for inactive segment */}
                                    <linearGradient id="inactiveSegGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#ffffff" />
                                        <stop offset="100%" stopColor="#f8fafc" />
                                    </linearGradient>

                                    {/* Gradient for hovered segment */}
                                    <linearGradient id="hoverSegGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#fff7ed" />
                                        <stop offset="100%" stopColor="#ffedd5" />
                                    </linearGradient>

                                    {/* Radial gradient for the central button */}
                                    <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stopColor="#f97316" />
                                        <stop offset="100%" stopColor="#ea580c" />
                                    </radialGradient>
                                </defs>


                                {renderSegments}

                                {/* Central Button Area */}
                                <g className="cursor-pointer group/center">
                                    {/* White plate base */}
                                    <circle
                                        cx="200"
                                        cy="200"
                                        r="80"
                                        fill="#ffffff"
                                        stroke="#f1f5f9"
                                        strokeWidth="2"
                                        className="transition-all duration-300"
                                    />

                                    {/* Dotted decorative interactive wheel */}
                                    <circle
                                        cx="200"
                                        cy="200"
                                        r="75"
                                        fill="none"
                                        stroke="#f97316"
                                        strokeWidth="1"
                                        strokeDasharray="4 3"
                                        className="opacity-40"
                                        style={{ transformOrigin: '200px 200px', animation: 'spin 60s linear infinite' }}
                                    />

                                    {hoveredIndex !== null ? (
                                        <g className="animate-entry-fade">
                                            <circle
                                                cx="200"
                                                cy="200"
                                                r="70"
                                                fill="none"
                                                stroke="#f97316"
                                                strokeWidth="1.5"
                                                className="opacity-20"
                                            />
                                            <text x="200" y="172" textAnchor="middle" className="fill-orange-600 text-[9px] font-black uppercase tracking-[0.15em]">
                                                {segments[hoveredIndex].month}
                                            </text>
                                            <text x="200" y="202" textAnchor="middle" className="fill-gray-900 text-3xl font-black tracking-tight">
                                                {segments[hoveredIndex].digit}
                                            </text>
                                            <text x="200" y="222" textAnchor="middle" className="fill-gray-400 text-[8px] font-extrabold uppercase tracking-widest">
                                                ÚLTIMO DÍGITO
                                            </text>
                                        </g>
                                    ) : (
                                        <g className="transition-all duration-300">
                                            <circle
                                                cx="200"
                                                cy="200"
                                                r="70"
                                                fill="url(#centerGradient)"
                                                className="group-hover/center:scale-[1.03] transition-transform duration-300"
                                                style={{ transformOrigin: '200px 200px' }}
                                            />
                                            <image
                                                href="/LogoRTPSanCristobal_horizontal.png"
                                                x="165"
                                                y="148"
                                                width="70"
                                                height="18"
                                                style={{ filter: 'brightness(0) invert(1)' }}
                                            />
                                            <text
                                                x="200"
                                                y="186"
                                                textAnchor="middle"
                                                className="fill-white text-[9px] font-black uppercase tracking-[0.2em]"
                                            >
                                                EXPLORA
                                            </text>
                                            <text
                                                x="200"
                                                y="210"
                                                textAnchor="middle"
                                                className="fill-white text-lg font-black uppercase tracking-tighter"
                                            >
                                                CRONOGRAMA
                                            </text>
                                            <path
                                                d="M 188 222 L 212 222"
                                                stroke="white"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                className="opacity-60"
                                            />
                                        </g>
                                    )}
                                </g>
                            </svg>

                            {/* Circuit decoration lines (Simulated with absolute divs for "style") */}
                            <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-orange-100 rounded-tr-[40px] -z-0" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-orange-100 rounded-bl-[40px] -z-0" />
                        </RevealOnScroll>
                    </div>

                    {/* Right Info Box */}
                    <div className="lg:col-span-2 order-3">
                        <RevealOnScroll className="h-full">
                            <div className="bg-white/40 backdrop-blur-xl border-2 border-orange-500/20 p-8 rounded-[40px] shadow-2xl h-full flex flex-col justify-center relative overflow-hidden group">
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-all" />

                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="text-orange-500" size={24} />
                                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Nota Importante</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                            El incumplimiento de la inspección en el mes asignado conlleva <span className="text-orange-600 font-bold">multas significativas</span> y recargos adicionales.
                                        </p>
                                        <p className="text-sm text-gray-500 italic">
                                            ¡Planifica a tiempo para evitar sanciones!
                                        </p>
                                        <div className="pt-4 border-t border-gray-100">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                                                Las citas están sujetas a disponibilidad según la sede elegida.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default InspectionWheel;
