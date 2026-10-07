import { FotoGaleria, fotosSede } from './galeria';

export interface Branch {
    id: number;
    name: string;
    /**
     * Identificador legible usado en la URL (`/sedes/sede-ica`).
     * Se deriva de `name` salvo que se defina explícitamente.
     */
    slug?: string;
    position: [number, number];
    address: string;
    /**
     * Distrito o ciudad real de la sede (`addressLocality` en schema.org).
     * No se infiere de la dirección: el texto de `address` a veces termina en
     * una referencia ("al lado de ESSALUD") y eso rompía los datos estructurados.
     */
    locality: string;
    /** Región administrativa (`addressRegion`): Callao, Lima, Ica, Apurímac… */
    addressRegion: string;
    /** Distritos y zonas cercanas que atiende la sede: copy local y keywords. */
    zonas?: string[];
    region: 'lima' | 'provincia';
    type: 'RTP' | 'RTV';
    googleMapsUrl?: string;
    wazeUrl?: string;
    placeId?: string; // Google Places ID, por si se integran reseñas reales en el futuro
    phone?: string;
    /** WhatsApp de la sede en formato internacional (solo dígitos, con 51). Si falta, usa WHATSAPP_INSPECCION. */
    whatsapp?: string;
    schedule?: string;
    image?: string;
    /** Fotos propias de la sede. Si no se define, se usa la galería de muestra. */
    galeria?: FotoGaleria[];
}

/**
 * WhatsApp central de atención para inspecciones vehiculares (RTV).
 * Formato internacional: código de país 51 + número, solo dígitos.
 */
export const WHATSAPP_INSPECCION = '51958077827';

/**
 * Normaliza un número al formato que exige wa.me (solo dígitos, con código de país).
 * Los móviles peruanos son 9 dígitos y empiezan por 9. Cualquier valor que no
 * cumpla ese formato (fijos, garbage, vacío) cae al número central.
 */
export function normalizeWhatsapp(phone?: string | null): string {
    const digits = (phone ?? '').replace(/\D/g, '');
    if (!digits) return WHATSAPP_INSPECCION;

    const nacional = digits.length > 9 && digits.startsWith('51')
        ? digits.slice(2)
        : digits;

    if (!/^9\d{8}$/.test(nacional)) return WHATSAPP_INSPECCION;
    return `51${nacional}`;
}

/** Construye el enlace de WhatsApp con el mensaje ya escrito. */
export function whatsappUrl(phone: string | null | undefined, mensaje: string): string {
    return `https://wa.me/${normalizeWhatsapp(phone)}?text=${encodeURIComponent(mensaje)}`;
}

/** Enlace de navegación en Google Maps a partir de coordenadas exactas. */
function mapsUrl(position: [number, number]): string {
    const [lat, lng] = position;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/** Enlace de navegación de Waze a partir de las coordenadas exactas. */
function wazeUrl(position: [number, number]): string {
    const [lat, lng] = position;
    return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
}

/**
 * Fotos reales de las sedes, tomadas de `public/WEB FOTOS/<carpeta>`.
 * La primera foto de cada lista se usa como portada en el listado de sedes.
 */
export const FOTOS_CANTA_CALLAO = fotosSede(
    'RTP_CANTACALLAO',
    [
        'WhatsApp Image 2026-10-05 at 12.19.08 PM.jpeg',
        'WhatsApp Image 2026-10-05 at 12.19.08 PM (1).jpeg',
        'WhatsApp Image 2026-10-05 at 12.19.08 PM (2).jpeg',
        'WhatsApp Image 2026-10-05 at 12.19.09 PM.jpeg',
    ],
    'Sede Canta Callao'
);

export const FOTOS_ICA = fotosSede(
    'RTV_ICA',
    Array.from({ length: 20 }, (_, i) => `${i + 1}.jpeg`),
    'Sede Ica'
);

export const FOTOS_HUANCAVELICA = fotosSede(
    'RTP_HUANCAVELICA',
    Array.from({ length: 5 }, (_, i) => `${i + 1}.jpeg`),
    'Sede Huancavelica'
);

// Cada sede de Ayacucho tiene su propia carpeta de fotos.
export const FOTOS_AYACUCHO_CUSCO = fotosSede(
    'RTP_AYACUCHO',
    Array.from({ length: 7 }, (_, i) => `${i + 1}.jpeg`),
    'Sede Ayacucho - Av. Cusco'
);

export const FOTOS_AYACUCHO_FENIX = fotosSede(
    'RTV_AYACUCHO',
    Array.from({ length: 4 }, (_, i) => `${i + 1}.jpeg`),
    'Sede Ayacucho - Grifo Fénix'
);

/**
 * Sede de la red.
 *
 * `position` se-geocodifico con Nominatim (OpenStreetMap) a partir de la
 * dirección y de las referencias de cada sede (restaurante, grifo, barrio).
 * Antes los datos tenían errores groseros: Ica apuntaba a Arequipa y tres sedes
 * apuntaban al mismo punto en Trujillo.
 *
 * La sede 1 (Callao) se actualizó con las coordenadas que entrega el enlace
 * corto de Google Maps que pasó el cliente, no con Nominatim. Ojo: el lugar
 * aparece registrado como "RTV SAN CRISTOBAL SAC", así que conviene confirmar
 * que el pin es el de la sede y no el de otra empresa del mismo grupo.
 *
 * PENDIENTE: las sedes 6 y 7 (Av. Cusco, Ayacucho) están a nivel de avenida,
 * porque OSM no registra los números de puerta ni los grifos de referencia.
 * Ambas comparten calle, así que están separadas a mano unos 200 m para que los
 * pines no se superponan. Requieren confirmación.
 */
const BRANCHES: Branch[] = [
    {
        id: 1,
        name: 'Sede Callao',
        // Google Maps: Av. Néstor Gambeta Mz. 1, 2 y 3, Las Orquídeas 2, Callao
        position: [-11.9844532, -77.1249420],
        address: 'Av. Néstor Gambeta Mz. 1, 2 y 3 - Las Orquídeas 2, Callao',
        locality: 'Callao',
        addressRegion: 'Callao',
        zonas: ['Las Orquídeas', 'Bellavista', 'La Perla', 'Carmen de la Legua', 'Mi Perú', 'Ventanilla', 'San Miguel'],
        region: 'lima',
        type: 'RTP',
        phone: '975759712',
        whatsapp: '51975759712',
        placeId: 'ChIJrfWkrCn94B4Rqh4FupC13Gk',
    },
    {
        id: 2,
        name: 'Sede Canta Callao',
        // OSM: Avenida Canta Callao, Santa Rosa, San Martín de Porres
        position: [-11.9843640, -77.1004699],
        address: 'Av. Canta Callao 164 - SMP, al lado de ESSALUD Bicentenario, entre la Av. Marañón y la Av. Canta Callao',
        locality: 'San Martín de Porres',
        addressRegion: 'Lima',
        zonas: ['San Martín de Porres', 'Santa Rosa', 'Los Olivos', 'Independencia', 'Comas', 'Puente Piedra'],
        region: 'lima',
        type: 'RTP',
        phone: '933697419',
        whatsapp: '51933697419',
        image: FOTOS_CANTA_CALLAO[0].src,
        galeria: FOTOS_CANTA_CALLAO,
    },
    {
        id: 3,
        name: 'Sede Ica',
        // Ubicación exacta de Google Maps (maps.app.goo.gl/AmDuW6jXTJnNvXGh8),
        // place 0x9110fd014a7650e7:0x7221bb9f92f3ef53, Km 299 Panamericana Sur.
        position: [-14.0363738, -75.7545413],
        address: 'Panamericana Sur km 299, frente al Grifo PECSA, al lado del restaurante "Donde Come el Rey", Subtanjalla',
        locality: 'Ica',
        addressRegion: 'Ica',
        zonas: ['Ica', 'Subtanjalla', 'La Tinguiña', 'Santiago', 'Los Aquijes', 'Parcona'],
        region: 'provincia',
        type: 'RTP',
        phone: '955403509',
        whatsapp: '51955403509',
        image: FOTOS_ICA[0].src,
        galeria: FOTOS_ICA,
    },
    {
        id: 4,
        name: 'Sede Andahuaylas',
        // OSM: Avenida Sesquicentenario, Cuncataca, Andahuaylas
        position: [-13.6607055, -73.4219941],
        address: 'Av. Sesquicentenario S/N, Predio Cuncataca - Valle Chumbao - Andahuaylas',
        locality: 'Andahuaylas',
        addressRegion: 'Apurímac',
        zonas: ['Andahuaylas', 'Talavera', 'San Jerónimo', 'Huancaraylla', 'Andarapa', 'Kishuara'],
        region: 'provincia',
        type: 'RTP',
        phone: '990906999',
        whatsapp: '51990906999',
    },
    {
        id: 5,
        name: 'Sede Huancavelica',
        // OSM: Malecón Fray Martín, Yananaco, San Cristobal, Huancavelica
        position: [-12.7844644, -74.9841287],
        address: 'Malecón Fray Martín 119, barrio de Yanacancha - Huancavelica',
        locality: 'Huancavelica',
        addressRegion: 'Huancavelica',
        zonas: ['Huancavelica', 'Ascensión', 'Santa Ana', 'Yauli', 'Acobamba', 'Mariscal Cáceres'],
        region: 'provincia',
        type: 'RTP',
        phone: '939063929',
        whatsapp: '51939063929',
        image: FOTOS_HUANCAVELICA[0].src,
        galeria: FOTOS_HUANCAVELICA,
    },
    {
        id: 6,
        name: 'Sede Ayacucho - Av. Cusco',
        // OSM: Avenida Cusco, San Juan Bautista. Número de puerta no disponible.
        position: [-13.1771520, -74.2002780],
        address: 'Av. Cusco 1633-1639, San Juan Bautista - Ayacucho, referencia curva Llama Gas',
        locality: 'Ayacucho',
        addressRegion: 'Ayacucho',
        zonas: ['Ayacucho', 'San Juan Bautista', 'Santa Ana', 'Tinga', 'Carmen Alto', 'Quinua'],
        region: 'provincia',
        type: 'RTP',
        phone: '943431908',
        whatsapp: '51943431908',
        image: FOTOS_AYACUCHO_CUSCO[0].src,
        galeria: FOTOS_AYACUCHO_CUSCO,
    },
    {
        id: 7,
        name: 'Sede Ayacucho - Grifo Fénix',
        // OSM: Avenida Cusco, San Juan Bautista. Separada ~200 m de la sede 6.
        position: [-13.1761990, -74.2020590],
        address: 'Av. Cusco Nº 1250, a una cuadra del Grifo Fénix y al frente del Grifo San Miguelito - Ayacucho',
        locality: 'Ayacucho',
        addressRegion: 'Ayacucho',
        zonas: ['Ayacucho', 'San Juan Bautista', 'Santa Ana', 'Tinga', 'Carmen Alto', 'Quinua'],
        region: 'provincia',
        type: 'RTP',
        phone: '908801161',
        whatsapp: '51908801161',
        image: FOTOS_AYACUCHO_FENIX[0].src,
        galeria: FOTOS_AYACUCHO_FENIX,
    },
];

/**
 * Convierte un nombre en un slug apto para URL: sin tildes, sin ñ, en minúsculas
 * y separado por guiones.
 *
 * "Sede Ayacucho - Av. Cusco" -> "sede-ayacucho-av-cusco"
 */
export function slugify(texto: string): string {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // quita las tildes que dejó NFD
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Slug de una sede. Usa el explícito si existe; si no, lo deriva del nombre.
 */
export function branchSlug(branch: Branch): string {
    return branch.slug ?? slugify(branch.name);
}

/**
 * Ruta pública de una sede. Todo enlace interno debe usar esta función para no
 * volver a los ids numéricos.
 */
export function branchHref(branch: Branch): string {
    return `/sedes/${branchSlug(branch)}`;
}

/**
 * Busca una sede por slug. Acepta también el id numérico para que las URLs
 * antigas (`/sedes/3`) sigan funcionando y redirijan a la nueva.
 */
export function findBranch(param: string | undefined): Branch | undefined {
    if (!param) return undefined;
    return (
        branches.find(b => branchSlug(b) === param) ??
        branches.find(b => String(b.id) === param)
    );
}

/** Links de navegación derivados de dirección y coordenadas. */
export const branches: Branch[] = BRANCHES.map((b) => ({
    ...b,
    slug: b.slug ?? slugify(b.name),
    googleMapsUrl: mapsUrl(b.position),
    wazeUrl: wazeUrl(b.position),
}));
