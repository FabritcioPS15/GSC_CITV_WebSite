import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MapPin, Car } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';

const tiposVehiculo = [
    { vehiculo: 'Vehículo particular', frecuencia: 'A partir del cuarto año de antigüedad.' },
    { vehiculo: 'Taxi', frecuencia: 'A partir del tercer año.' },
    { vehiculo: 'Transporte público de pasajeros', frecuencia: 'A partir del tercer año.' },
    { vehiculo: 'Transporte turístico', frecuencia: 'A partir del tercer año.' },
    { vehiculo: 'Transporte de carga', frecuencia: 'A partir del tercer año, según su categoría.' },
    { vehiculo: 'Transporte de materiales peligrosos', frecuencia: 'A partir del tercer año.' }
];

interface WheelSegment {
    digit: number;
    lines: string[];
    monthLong: string;
    monthsCovered: number[]; // 0-indexed JS month (0=Ene, 1=Feb, etc.)
}

// 10 sectores oficiales MTC: 0 al 9
const segments: WheelSegment[] = [
    { digit: 0, lines: ['ENERO', 'FEBRERO'], monthLong: 'Enero y Febrero', monthsCovered: [0, 1] },
    { digit: 1, lines: ['MARZO'], monthLong: 'Marzo', monthsCovered: [2] },
    { digit: 2, lines: ['ABRIL'], monthLong: 'Abril', monthsCovered: [3] },
    { digit: 3, lines: ['MAYO'], monthLong: 'Mayo', monthsCovered: [4] },
    { digit: 4, lines: ['JUNIO'], monthLong: 'Junio', monthsCovered: [5] },
    { digit: 5, lines: ['JULIO', 'AGOSTO'], monthLong: 'Julio y Agosto', monthsCovered: [6, 7] },
    { digit: 6, lines: ['SETIEMBRE'], monthLong: 'Setiembre', monthsCovered: [8] },
    { digit: 7, lines: ['OCTUBRE'], monthLong: 'Octubre', monthsCovered: [9] },
    { digit: 8, lines: ['NOVIEMBRE'], monthLong: 'Noviembre', monthsCovered: [10] },
    { digit: 9, lines: ['DICIEMBRE'], monthLong: 'Diciembre', monthsCovered: [11] }
];

const InspectionWheel: React.FC = () => {
    // El sector se elige con un clic y la selección se mantiene hasta que se
    // elige otro: antes se resaltaba al pasar el cursor, lo que hacia que el
    // detalle de la placa central cambiara solo y fuera imposible de leer.
    const [selectedDigit, setSelectedDigit] = useState<number | null>(null);

    const selectDigit = useCallback((digit: number) => {
        setSelectedDigit((prev) => (prev === digit ? null : digit));
    }, []);

    // Mes actual en tiempo real
    const currentMonth = useMemo(() => new Date().getMonth(), []);
    const currentSegment = useMemo(
        () => segments.find((s) => s.monthsCovered.includes(currentMonth)) || segments[0],
        [currentMonth]
    );

    const activeDigit = selectedDigit;
    const activeSegment = useMemo(
        () => segments.find((s) => s.digit === selectedDigit) || null,
        [selectedDigit]
    );

    // Renderizar los 10 segmentos SVG
    const renderSegments = useMemo(() => {
        const radius = 188;
        const centerX = 200;
        const centerY = 200;
        const segmentAngle = 360 / segments.length; // 36° por segmento
        const inset = 0.6; // Separación limpia entre sectores

        const toXY = (angle: number, dist: number) => {
            const rad = (angle * Math.PI) / 180;
            return { x: centerX + dist * Math.cos(rad), y: centerY + dist * Math.sin(rad) };
        };

        return segments.map((seg, i) => {
            // El dígito 0 está arriba a 12 en punto (-90°)
            const midAngle = -90 + i * segmentAngle;
            const startAngle = midAngle - segmentAngle / 2 + inset;
            const endAngle = midAngle + segmentAngle / 2 - inset;

            const outerStart = toXY(startAngle, radius);
            const outerEnd = toXY(endAngle, radius);
            const pathData = `M ${centerX} ${centerY} L ${outerStart.x} ${outerStart.y} A ${radius} ${radius} 0 0 1 ${outerEnd.x} ${outerEnd.y} Z`;

            const isTwoLines = seg.lines.length > 1;
            const boxWidth = 52;
            const boxHeight = isTwoLines ? 21 : 14.5;
            const digitHeight = 15;
            const gap = 4;
            const totalStackHeight = digitHeight + gap + boxHeight;

            // Centroide geométrico de cada sector (radio medio entre r_inner=94 y r_outer=188)
            const sectorCenter = toXY(midAngle, 143);

            // Posición centrada verticalmente del conjunto (Dígito + Caja) en el sector
            const digitY = sectorCenter.y - totalStackHeight / 2 + digitHeight / 2;
            const digitPos = { x: sectorCenter.x, y: digitY };

            const boxY = sectorCenter.y + totalStackHeight / 2 - boxHeight / 2;
            const boxPos = { x: sectorCenter.x, y: boxY };

            const isCurrentMonth = seg.digit === currentSegment.digit;
            const isSelected = selectedDigit === seg.digit;

            const fill = isCurrentMonth
                ? 'url(#activeSegGrad)'
                : isSelected
                    ? 'url(#selectedSegGrad)'
                    : 'url(#inactiveSegGrad)';

            return (
                <g
                    key={seg.digit}
                    className="group/segment cursor-pointer"
                    onClick={() => selectDigit(seg.digit)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            selectDigit(seg.digit);
                        }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    aria-label={`Dígito ${seg.digit}: Placas que deben pasar inspección en ${seg.monthLong}`}
                    style={{
                        transformOrigin: '200px 200px',
                        transform: isSelected ? 'scale(1.025)' : 'scale(1)',
                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                >
                    {/* Fondo del sector */}
                    <path
                        d={pathData}
                        fill={fill}
                        stroke={isCurrentMonth ? '#ffffff' : isSelected ? '#ea580c' : '#e2e8f0'}
                        strokeWidth={isCurrentMonth ? '2.5' : isSelected ? '2' : '1.5'}
                        className="transition-all duration-300"
                        style={{
                            filter: isCurrentMonth
                                ? 'drop-shadow(0 6px 14px rgba(249, 115, 22, 0.35))'
                                : 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.02))'
                        }}
                    />

                    {/* DÍGITO CON FLECHAS AMARILLAS ◀ D ▶ (Totalmente horizontal) */}
                    <g>
                        {/* Flecha izquierda */}
                        <polygon
                            points={`${digitPos.x - 13.5},${digitPos.y} ${digitPos.x - 8.5},${digitPos.y - 3.8} ${digitPos.x - 8.5},${digitPos.y + 3.8}`}
                            fill="#eab308"
                        />
                        {/* Dígito central */}
                        <text
                            x={digitPos.x}
                            y={digitPos.y}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize="19"
                            fontWeight="900"
                            fontFamily="system-ui, -apple-system, sans-serif"
                            className={`transition-colors duration-200 select-none ${
                                isCurrentMonth ? 'fill-white' : isSelected ? 'fill-orange-600' : 'fill-gray-900'
                            }`}
                        >
                            {seg.digit}
                        </text>
                        {/* Flecha derecha */}
                        <polygon
                            points={`${digitPos.x + 13.5},${digitPos.y} ${digitPos.x + 8.5},${digitPos.y - 3.8} ${digitPos.x + 8.5},${digitPos.y + 3.8}`}
                            fill="#eab308"
                        />
                    </g>

                    {/* CAJA RECTANGULAR AZUL MARINO CON LOS MESES (Horizontal) */}
                    <g>
                        <rect
                            x={boxPos.x - boxWidth / 2}
                            y={boxPos.y - boxHeight / 2}
                            width={boxWidth}
                            height={boxHeight}
                            rx="2.5"
                            ry="2.5"
                            fill={isCurrentMonth ? '#001e3d' : isSelected ? '#ea580c' : '#0a2540'}
                            className="transition-colors duration-200 drop-shadow-sm"
                        />
                        {isTwoLines ? (
                            <>
                                <text
                                    x={boxPos.x}
                                    y={boxPos.y - 4}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fill="#ffffff"
                                    fontSize="6.8"
                                    fontWeight="800"
                                    letterSpacing="0.03em"
                                    fontFamily="system-ui, -apple-system, sans-serif"
                                    className="select-none"
                                >
                                    {seg.lines[0]}
                                </text>
                                <text
                                    x={boxPos.x}
                                    y={boxPos.y + 4}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fill="#ffffff"
                                    fontSize="6.8"
                                    fontWeight="800"
                                    letterSpacing="0.03em"
                                    fontFamily="system-ui, -apple-system, sans-serif"
                                    className="select-none"
                                >
                                    {seg.lines[1]}
                                </text>
                            </>
                        ) : (
                            <text
                                x={boxPos.x}
                                y={boxPos.y}
                                textAnchor="middle"
                                dominantBaseline="central"
                                fill="#ffffff"
                                fontSize="7"
                                fontWeight="800"
                                letterSpacing="0.03em"
                                fontFamily="system-ui, -apple-system, sans-serif"
                                className="select-none"
                            >
                                {seg.lines[0]}
                            </text>
                        )}
                    </g>
                </g>
            );
        });
    }, [currentSegment, selectedDigit, selectDigit]);

    return (
        <section className="section bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">

                    {/* Left Content */}
                    <div className="lg:col-span-3 order-2 lg:order-1">
                        <RevealOnScroll>
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-14 bg-orange-500 rounded-full shrink-0" />
                                    <h2 className="text-3xl font-black text-gray-900 leading-tight uppercase tracking-tighter">
                                        Rueda de <br />
                                        <span className="text-orange-500">Inspecciones</span>
                                    </h2>
                                </div>

                                <p className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-orange-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                                    Mes actual: {currentSegment.monthLong}
                                </p>

                                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                    Ubica en la rueda el mes que le corresponde a tu placa según su <strong>último dígito</strong>.
                                    Haz clic en el sector para ver el detalle.
                                </p>

                                {/* Leyenda */}
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2.5 text-xs font-bold text-gray-600">
                                        <span className="w-4 h-4 rounded-md bg-gradient-to-br from-[#ff9f43] to-[#ff5e00] shrink-0" />
                                        Mes en curso (dígito {currentSegment.digit})
                                    </li>
                                    <li className="flex items-center gap-2.5 text-xs font-bold text-gray-600">
                                        <span className="w-4 h-4 rounded-md bg-gradient-to-br from-[#fff7ed] to-[#ffedd5] border border-orange-300 shrink-0" />
                                        Sector seleccionado
                                    </li>
                                    <li className="flex items-center gap-2.5 text-xs font-bold text-gray-600">
                                        <span className="w-4 h-4 rounded-md bg-white border border-gray-300 shrink-0" />
                                        Demás meses del año
                                    </li>
                                </ul>

                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Cómo usarlo:</p>
                                    <ul className="space-y-3">
                                        {[
                                            'Identifica el mes según tu último dígito',
                                            'Haz clic en el sector para ver el detalle',
                                            'Vuelve a hacer clic para cerrar el detalle',
                                            'Agenda tu cita con anticipación'
                                        ].map((text, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm font-bold text-gray-700">
                                                <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                                                    {i + 1}
                                                </span>
                                                {text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Qué necesitas:</p>
                                    <ul className="grid grid-cols-1 gap-3">
                                        {['Tarjeta de propiedad', 'DNI o RUC', 'SOAT vigente'].map((req) => (
                                            <li key={req} className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                                <CheckCircle2 size={14} className="text-orange-500 shrink-0" />
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link
                                    to="/sedes"
                                    className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white hover:bg-black transition-colors"
                                >
                                    <MapPin size={14} className="shrink-0" />
                                    Ver sedes
                                </Link>
                            </div>
                        </RevealOnScroll>
                    </div>

                    {/* Middle Wheel */}
                    <div className="lg:col-span-9 relative flex items-center justify-center order-1 lg:order-2">
                        <RevealOnScroll className="relative w-full max-w-[680px] aspect-square mx-auto">
                            {/* Background decoration elements */}
                            <div className="absolute inset-[6%] bg-orange-500/5 rounded-full blur-3xl scale-110 animate-pulse" />

                            {/* The Wheel SVG */}
                            <svg
                                viewBox="0 0 400 400"
                                className="w-full h-full drop-shadow-2xl relative z-10 select-none"
                                role="img"
                                aria-label="Rueda de inspecciones: mes según el último dígito de la placa"
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

                                    {/* Gradient for selected segment */}
                                    <linearGradient id="selectedSegGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#fff7ed" />
                                        <stop offset="100%" stopColor="#ffedd5" />
                                    </linearGradient>
                                </defs>

                                {/* Borde exterior de la rueda */}
                                <circle
                                    cx="200"
                                    cy="200"
                                    r="189"
                                    fill="none"
                                    stroke="#e2e8f0"
                                    strokeWidth="2"
                                />

                                {/* 10 Sectores */}
                                {renderSegments}

                                {/* ÁREA CENTRAL DE LA PLACA PERUANA */}
                                <g className="cursor-default">
                                    {/* Base circular blanca central */}
                                    <circle
                                        cx="200"
                                        cy="200"
                                        r="82"
                                        fill="#ffffff"
                                        stroke="#f1f5f9"
                                        strokeWidth="2"
                                        className="transition-all duration-300"
                                        style={{ filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.05))' }}
                                    />

                                    {/* Anillo decorativo sutil punteado */}
                                    <circle
                                        cx="200"
                                        cy="200"
                                        r="78"
                                        fill="none"
                                        stroke="#f97316"
                                        strokeWidth="0.8"
                                        strokeDasharray="3 3"
                                        className="opacity-30"
                                    />

                                    {/* Texto superior: SI TU PLACA TERMINA EN: */}
                                    <text
                                        x="200"
                                        y="154"
                                        textAnchor="middle"
                                        fill="#0f172a"
                                        fontSize="10"
                                        fontWeight="900"
                                        letterSpacing="0.03em"
                                        fontFamily="system-ui, -apple-system, sans-serif"
                                        className="select-none"
                                    >
                                        SI TU PLACA
                                    </text>
                                    <text
                                        x="200"
                                        y="167"
                                        textAnchor="middle"
                                        fill="#0f172a"
                                        fontSize="10"
                                        fontWeight="900"
                                        letterSpacing="0.03em"
                                        fontFamily="system-ui, -apple-system, sans-serif"
                                        className="select-none"
                                    >
                                        TERMINA EN:
                                    </text>

                                    {/* PLACA PERUANA OFICIAL */}
                                    <g transform="translate(146, 175)">
                                        {/* Marco exterior blanco */}
                                        <rect
                                            x="0"
                                            y="0"
                                            width="108"
                                            height="49"
                                            rx="5.5"
                                            ry="5.5"
                                            fill="#ffffff"
                                            stroke="#111827"
                                            strokeWidth="2.5"
                                        />

                                        {/* Franja superior amarilla peruana */}
                                        <path
                                            d="M 1 5.5 A 4.5 4.5 0 0 1 5.5 1 L 102.5 1 A 4.5 4.5 0 0 1 107 5.5 L 107 15 L 1 15 Z"
                                            fill="#ffd100"
                                        />
                                        <line
                                            x1="0"
                                            y1="15"
                                            x2="108"
                                            y2="15"
                                            stroke="#111827"
                                            strokeWidth="1.8"
                                        />

                                        {/* Bandera peruana */}
                                        <g transform="translate(6, 3.5)">
                                            <rect x="0" y="0" width="3.2" height="8" fill="#dc2626" />
                                            <rect x="3.2" y="0" width="3.2" height="8" fill="#ffffff" />
                                            <rect x="6.4" y="0" width="3.2" height="8" fill="#dc2626" />
                                            <rect x="0" y="0" width="9.6" height="8" fill="none" stroke="#111827" strokeWidth="0.6" />
                                        </g>

                                        {/* Texto PERU */}
                                        <text
                                            x="58"
                                            y="8"
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                            fill="#111827"
                                            fontSize="9"
                                            fontWeight="900"
                                            letterSpacing="0.2em"
                                            fontFamily="system-ui, -apple-system, sans-serif"
                                            className="select-none"
                                        >
                                            PERU
                                        </text>

                                        {/* Número de placa con interacción en el último dígito */}
                                        <text
                                            x="54"
                                            y="32"
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                            fill="#111827"
                                            fontSize="20"
                                            fontWeight="900"
                                            fontFamily="'Consolas', 'Courier New', monospace"
                                            letterSpacing="0.04em"
                                            className="select-none"
                                        >
                                            A3G-15
                                            <tspan
                                                fill={activeDigit !== null ? '#ea580c' : '#111827'}
                                                fontWeight="900"
                                            >
                                                {activeDigit !== null ? activeDigit : '?'}
                                            </tspan>
                                        </text>
                                    </g>

                                    {/* Texto inferior: TU REVISIÓN ES EN EL MES DE... */}
                                    <text
                                        x="200"
                                        y="240"
                                        textAnchor="middle"
                                        fill="#0f172a"
                                        fontSize="7.5"
                                        fontWeight="800"
                                        letterSpacing="0.02em"
                                        fontFamily="system-ui, -apple-system, sans-serif"
                                        className="select-none"
                                    >
                                        TU REVISIÓN ES EN EL MES DE
                                    </text>

                                    {activeSegment ? (
                                        <text
                                            x="200"
                                            y="252"
                                            textAnchor="middle"
                                            fill="#ea580c"
                                            fontSize="8.5"
                                            fontWeight="900"
                                            letterSpacing="0.03em"
                                            fontFamily="system-ui, -apple-system, sans-serif"
                                            className="select-none"
                                        >
                                            {activeSegment.monthLong.toUpperCase()}
                                        </text>
                                    ) : (
                                        <text
                                            x="200"
                                            y="252"
                                            textAnchor="middle"
                                            fill="#0f172a"
                                            fontSize="8"
                                            fontWeight="800"
                                            letterSpacing="0.02em"
                                            fontFamily="system-ui, -apple-system, sans-serif"
                                            className="select-none"
                                        >
                                            HAZ CLIC EN UN DÍGITO
                                        </text>
                                    )}
                                </g>
                            </svg>
                        </RevealOnScroll>
                    </div>

                </div>

                {/* Recordatorio: tipo de vehículo y frecuencia de inspección */}
                <RevealOnScroll>
                    <div className="mt-20 pt-12 border-t border-gray-100">
                        <div className="border-l-4 border-orange-500 pl-4 mb-8">
                            <h3 className="text-2xl font-bold text-gray-900">¿Cada cuánto debe revisarse?</h3>
                            <p className="text-gray-600 mt-1">La frecuencia depende del tipo de vehículo y del servicio que presta</p>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 bg-gray-50 border-b border-gray-200">
                                <p className="px-5 py-3 text-[11px] font-black uppercase tracking-[0.15em] text-gray-500">
                                    Tipo de vehículo
                                </p>
                                <p className="px-5 py-3 text-[11px] font-black uppercase tracking-[0.15em] text-gray-500 sm:border-l sm:border-gray-200">
                                    Primera inspección
                                </p>
                            </div>

                            {tiposVehiculo.map((tipo) => (
                                <div
                                    key={tipo.vehiculo}
                                    className="grid grid-cols-1 sm:grid-cols-2 border-b border-gray-100 last:border-b-0 hover:bg-orange-50/50 transition-colors"
                                >
                                    <p className="px-5 py-4 text-sm font-bold text-gray-900 flex items-center gap-2.5">
                                        <Car size={14} className="text-orange-500 shrink-0" />
                                        {tipo.vehiculo}
                                    </p>
                                    <p className="px-5 py-4 text-sm text-gray-600 sm:border-l sm:border-gray-100">
                                        {tipo.frecuencia}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <p className="mt-4 text-sm text-gray-500 italic">
                            La antigüedad se cuenta desde el año de fabricación, de acuerdo con las reglas aplicables a cada categoría y servicio.
                        </p>
                    </div>
                </RevealOnScroll>
            </div>
        </section>
    );
};

export default InspectionWheel;
