import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FotoGaleria } from '../../backend/data/galeria';

interface GalleryCarouselProps {
    imagenes: FotoGaleria[];
    /** Etiqueta del lugar, se muestra junto al título. */
    titulo?: string;
}

/** Carrusel de fotos con bordes rectos, en línea con el estilo de la tabla de tarifas. */
export default function GalleryCarousel({ imagenes, titulo }: GalleryCarouselProps) {
    const [indice, setIndice] = useState(0);
    const total = imagenes.length;

    if (!total) return null;

    const ir = (delta: number) => setIndice((p) => (p + delta + total) % total);
    const actual = imagenes[indice];

    return (
        <div className="bg-white border border-gray-200 lg:h-full lg:flex lg:flex-col">
            {/* Cabecera */}
            <div className="lg:shrink-0 flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 bg-gray-900">
                <span className="text-[9px] font-black uppercase tracking-widest text-white truncate min-w-0">
                    {titulo ?? 'Galería de la sede'}
                </span>
                <span className="shrink-0 stat-num text-[10px] font-black text-white/60 tabular-nums">
                    {String(indice + 1).padStart(2, '0')}
                    <span className="mx-1 text-white/30">/</span>
                    {String(total).padStart(2, '0')}
                </span>
            </div>

            {/* En móvil manda el ratio; en escritorio se estira para igualar la tabla. */}
            <div className="relative aspect-[4/3] lg:aspect-auto lg:flex-1 lg:min-h-0 bg-gray-100 overflow-hidden">
                <img
                    key={actual.src}
                    src={actual.src}
                    alt={actual.alt}
                    loading="lazy"
                    className="w-full h-full object-cover animate-fade-in"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                    <p className="text-xs text-white leading-relaxed">{actual.alt}</p>
                </div>
            </div>

            {/* Controles */}
            <div className="lg:shrink-0 flex items-center justify-between px-3 py-2.5 border-t border-gray-200">
                <button
                    type="button"
                    onClick={() => ir(-1)}
                    aria-label="Foto anterior"
                    className="flex items-center justify-center w-8 h-8 text-gray-500 border border-gray-200 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors duration-200"
                >
                    <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1.5">
                    {imagenes.map((foto, i) => (
                        <button
                            key={foto.src}
                            type="button"
                            onClick={() => setIndice(i)}
                            aria-label={`Ir a la foto ${i + 1}`}
                            aria-current={i === indice}
                            className={`h-1.5 transition-all duration-300 ${
                                i === indice ? 'w-7 bg-[#f97316]' : 'w-1.5 bg-gray-300 hover:bg-gray-500'
                            }`}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => ir(1)}
                    aria-label="Foto siguiente"
                    className="flex items-center justify-center w-8 h-8 text-gray-500 border border-gray-200 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors duration-200"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
