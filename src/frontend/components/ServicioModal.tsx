import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, CheckCircle2 } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useBloqueoScroll } from '../hooks/useBloqueoScroll';
import { whatsappUrl, WHATSAPP_INSPECCION } from '../../backend/data/branches';

export interface ServicioDetalle {
    titulo: string;
    imagen: string;
    /** Texto largo que se lee dentro del popup. */
    detalle: string;
    /** Lista de "Qué incluye". */
    incluye: string[];
}

interface ServicioModalProps extends ServicioDetalle {
    onClose: () => void;
    /** Antetítulo sobre la imagen. */
    eyebrow?: string;
    /** Si se pasa, muestra "Disponible en {sede}". */
    sedeNombre?: string;
    /** Teléfono de WhatsApp a usar en el botón Consultar. */
    whatsapp?: string;
}

/**
 * Popup de detalle de un servicio de inspección.
 *
 * Se monta en un portal sobre `document.body` para no quedar atrapado dentro de
 * contenedores con `overflow-hidden` o transformadas. Cierra con X, click en el
 * overlay y Escape, y bloquea el scroll del body mientras está abierto.
 */
export default function ServicioModal({
    titulo,
    imagen,
    detalle,
    incluye,
    onClose,
    eyebrow = 'Servicio de Inspección',
    sedeNombre,
    whatsapp
}: ServicioModalProps) {
    useBloqueoScroll(true);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    const mensaje = sedeNombre
        ? `Hola, quisiera información sobre ${titulo} en ${sedeNombre}.`
        : `Hola, quisiera información sobre ${titulo}.`;

    return ReactDOM.createPortal(
        <>
            <div className="modal-overlay overscroll-contain" onClick={onClose} />
            <div className="modal-container">
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="servicio-modal-title"
                    className="modal-content w-full max-w-2xl overflow-y-auto overscroll-contain rounded-[32px] bg-white shadow-2xl animate-entry-slide-down"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Cabecera con imagen */}
                    <div className="relative h-48 overflow-hidden">
                        <img
                            src={imagen}
                            alt={titulo}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Cerrar"
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all active:scale-95"
                        >
                            <X size={20} />
                        </button>
                        <div className="absolute bottom-5 left-6 right-6">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f97316]">
                                {eyebrow}
                            </p>
                            <h3
                                id="servicio-modal-title"
                                className="text-3xl font-black uppercase tracking-tight text-white leading-tight mt-1"
                            >
                                {titulo}
                            </h3>
                        </div>
                    </div>

                    {/* Detalle */}
                    <div className="p-6 sm:p-8 space-y-6">
                        <p className="content-text text-gray-600">{detalle}</p>

                        <div>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3">
                                Qué incluye
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {incluye.map((item) => (
                                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#f97316]" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {sedeNombre && (
                            <p className="text-xs text-gray-400">
                                Disponible en <span className="font-semibold text-gray-600">{sedeNombre}</span>.
                            </p>
                        )}
                    </div>

                    {/* Acciones */}
                    <div className="p-6 sm:p-8 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <a
                            href={whatsappUrl(whatsapp || WHATSAPP_INSPECCION, mensaje)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2.5 rounded-2xl bg-green-500 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-green-500/20 transition-colors hover:bg-green-600"
                        >
                            <FaWhatsapp size={18} /> Consultar
                        </a>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-4 text-xs font-black uppercase tracking-widest text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}