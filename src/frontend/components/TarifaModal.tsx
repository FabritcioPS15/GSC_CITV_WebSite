import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    X,
    Car,
    Bus,
    Truck,
    AlertTriangle,
    Star,
    Tag,
    Building2,
    ClipboardList,
    Check,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { TarifaItem } from '../../backend/data/tarifario';

const iconos: Record<string, typeof Car> = {
    car: Car,
    bus: Bus,
    truck: Truck,
    alert: AlertTriangle,
    star: Star,
};

interface TarifaModalProps {
    item: TarifaItem | null;
    categoriaLabel: string;
    icono: string;
    precio?: number;
    /** True si el precio viene de un override propio de la sede. */
    esPrecioDeSede: boolean;
    sedeNombre: string;
    /** Documentación requerida para este vehículo. */
    requisitos: string[];
    onClose: () => void;
    onConsultar: () => void;
}

/** Ficha del vehículo: detalle de la tarifa, con salida a WhatsApp. */
export default function TarifaModal({
    item,
    categoriaLabel,
    icono,
    precio,
    esPrecioDeSede,
    sedeNombre,
    requisitos,
    onClose,
    onConsultar,
}: TarifaModalProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const botonRef = useRef<HTMLButtonElement>(null);

    // Escape cierra, y el fondo no hace scroll mientras el modal está abierto.
    useEffect(() => {
        if (!item) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);

        const overflowAnterior = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        botonRef.current?.focus();

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = overflowAnterior;
        };
    }, [item, onClose]);

    if (!item) return null;

    const Icon = iconos[icono] ?? Car;

    // Se monta en document.body a propósito: el modal se renderiza dentro de
    // RevealOnScroll, que aplica `transform`, y eso convertiría al wrapper en el
    // bloque contenedor del `position: fixed`, dejando el modal descentrado.
    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tarifa-modal-titulo"
        >
            <div
                ref={panelRef}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md bg-white border border-gray-200 shadow-2xl animate-scale-in flex flex-col max-h-[90dvh]"
            >
                {/* Cabecera */}
                <div className="shrink-0 flex items-start gap-3 px-5 py-4 bg-gray-900 text-white">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#f97316] shrink-0">
                        <Icon size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/60">
                            {categoriaLabel}
                        </p>
                        <h3
                            id="tarifa-modal-titulo"
                            className="text-lg font-black uppercase tracking-tight leading-tight"
                        >
                            {item.label}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar"
                        className="shrink-0 flex items-center justify-center w-8 h-8 text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Cuerpo con scroll propio */}
                <div className="flex-1 overflow-y-auto">
                {/* Cuerpo */}
                <div className="px-5 py-5">
                    <p className="text-sm text-gray-600 leading-relaxed">{item.descripcion}</p>

                    <div className="mt-5 border border-gray-200">
                        <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-gray-200 bg-gray-50">
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                                Tarifa
                            </span>
                            <div className="flex items-baseline gap-1">
                                {typeof precio === 'number' ? (
                                    <>
                                        <span className="text-xs font-bold text-gray-400">S/</span>
                                        <span className="stat-num text-3xl font-black text-gray-900 leading-none">
                                            {precio}
                                        </span>
                                        <span className="text-xs font-bold text-gray-400">.00</span>
                                    </>
                                ) : (
                                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                                        Consultar
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-200">
                            <Building2 size={15} className="text-gray-400 shrink-0" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                                Sede
                            </span>
                            <span className="ml-auto text-sm font-black text-gray-900 text-right">
                                {sedeNombre}
                            </span>
                        </div>

                        <div className="flex items-center gap-2.5 px-4 py-3">
                            <Tag size={15} className="text-gray-400 shrink-0" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                                Lista de precios
                            </span>
                            <span className="ml-auto text-xs font-bold text-gray-600 text-right">
                                {esPrecioDeSede ? 'Tarifa de esta sede' : 'Tarifa general'}
                            </span>
                        </div>
                    </div>

                    <p className="mt-4 text-[11px] text-gray-400 leading-relaxed">
                        El precio incluye IGV. La tarifa final puede variar según la disponibilidad de
                        Inspectores Autorizados.
                    </p>
                </div>

                {/* Requisitos del vehículo */}
                <div className="px-5 pb-5">
                    <div className="flex items-center gap-2.5 mb-3">
                        <ClipboardList size={16} className="text-[#f97316] shrink-0" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                            Requisitos para este vehículo
                        </h4>
                    </div>
                    <ul className="space-y-2">
                        {requisitos.map((req) => (
                            <li key={req} className="flex items-start gap-2.5">
                                <span className="mt-0.5 flex items-center justify-center w-4 h-4 bg-orange-100 text-orange-600 shrink-0">
                                    <Check size={11} strokeWidth={3} />
                                </span>
                                <span className="text-xs text-gray-600 leading-relaxed">{req}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                </div>

                {/* Pie: cerrar o consultar */}
                <div className="shrink-0 flex items-stretch border-t border-gray-200">
                    <button
                        ref={botonRef}
                        type="button"
                        onClick={onClose}
                        className="flex-1 flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                    >
                        <X size={15} />
                        Cerrar
                    </button>
                    <button
                        type="button"
                        onClick={onConsultar}
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#25D366] hover:bg-[#1eb85a] text-white text-xs font-black uppercase tracking-widest transition-colors duration-200"
                    >
                        <FaWhatsapp size={16} />
                        Consultar
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
