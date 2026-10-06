export interface FotoGaleria {
    src: string;
    alt: string;
}

/**
 * Fotos de muestra para el carrusel de sedes.
 * Son imágenes genéricas de taller/vehículo: reemplazar por fotos reales de cada sede.
 */
export const GALERIA_DEFAULT: FotoGaleria[] = [
    {
        src: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        alt: 'Vehículo listo para la inspección técnica.',
    },
    {
        src: 'https://images.unsplash.com/photo-1632733711679-5292d6863f12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        alt: 'Estación de inspección con equipo técnico.',
    },
    {
        src: 'https://images.unsplash.com/photo-1580273916550-e323be2eb5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        alt: 'Revisión de Louvres y sistema de escape.',
    },
    {
        src: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Inspector autorizado verificando el vehículo.',
    },
    {
        src: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Área de espera y atención al conductor.',
    },
    {
        src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        alt: 'Certificación vehicular al día.',
    },
];

/** Devuelve la galería de una sede, o la de muestra si la sede no define la suya. */
export function getGaleria(galeriaSede?: FotoGaleria[] | null): FotoGaleria[] {
    return galeriaSede && galeriaSede.length ? galeriaSede : GALERIA_DEFAULT;
}

/** Carpeta pública con las fotos reales de las sedes. Lleva espacio, por eso el %20. */
const WEB_FOTOS = '/WEB%20FOTOS';

/**
 * Galería de una sede a partir de sus fotos en `public/WEB FOTOS/<carpeta>`.
 * Los nombres de archivo pueden traer espacios, así que se codifican.
 */
export function fotosSede(carpeta: string, archivos: string[], sede: string): FotoGaleria[] {
    return archivos.map((archivo, i) => ({
        src: `${WEB_FOTOS}/${carpeta}/${encodeURI(archivo)}`,
        alt: `${sede} - foto ${i + 1}`,
    }));
}
