import { FotoGaleria } from './galeria';

export interface Branch {
    id: number;
    name: string;
    position: [number, number];
    address: string;
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
    /** Overrides de precio por tarifa para esta sede. Si no existe, se usa el precio base del tarifario. */
    tarifario?: Record<string, number>;
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

/** Enlace de búsqueda en Google Maps a partir de la dirección (no inventamos un pin). */
function mapsUrl(address: string): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/** Enlace de navegación de Waze a partir de las coordenadas. */
function wazeUrl(position: [number, number]): string {
    const [lat, lng] = position;
    return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
}

/**
 * Sede de la red.
 *
 * `position` fue geocodificado con Nominatim (OpenStreetMap) a partir de la
 * dirección y de las referencias de cada sede (restaurante, grifo, barrio).
 * Antes los datos tenían errores groseros: Ica apuntaba a Arequipa y tres sedes
 * apuntaban al mismo punto en Trujillo.
 *
 * PENDIENTE: las sedes 6 y 7 (Av. Cusco, Ayacucho) están a nivel de avenida,
 * porque OSM no registra los números de puerta ni los grifos de referencia.
 * Ambas comparten calle, así que están separadas a mano unos 200 m para que los
 * pines no se superpongan. Requieren confirmación.
 */
const BRANCHES: Branch[] = [
    {
        id: 1,
        name: 'Sede Callao',
        // OSM: Avenida de la Alameda, Gambetta Baja, Callao
        position: [-12.0426373, -77.1164993],
        address: 'Av. Néstor Gambeta Mz. A Lt. 2 Alt. Paradero Zeta Gas, a una cuadra del Terminal Pesquero',
        region: 'lima',
        type: 'RTP',
        phone: '975759712',
        whatsapp: '51975759712',
    },
    {
        id: 2,
        name: 'Sede Canta Callao',
        // OSM: Avenida Canta Callao, Santa Rosa, San Martín de Porres
        position: [-11.9843640, -77.1004699],
        address: 'Av. Canta Callao 164 - SMP, al lado de ESSALUD Bicentenario, entre la Av. Marañón y la Av. Canta Callao',
        region: 'lima',
        type: 'RTP',
        phone: '933697419',
        whatsapp: '51933697419',
    },
    {
        id: 3,
        name: 'Sede Ica',
        // OSM: "Donde Come El Rey", Subtanjalla (coincide con la referencia del local)
        position: [-14.0358645, -75.7545937],
        address: 'Panamericana Sur km 299, frente al Grifo PECSA, al lado del restaurante "Donde Come el Rey", Subtanjalla',
        region: 'provincia',
        type: 'RTP',
        phone: '955403509',
        whatsapp: '51955403509',
    },
    {
        id: 4,
        name: 'Sede Andahuaylas',
        // OSM: Avenida Sesquicentenario, Cuncataca, Andahuaylas
        position: [-13.6607055, -73.4219941],
        address: 'Av. Sesquicentenario S/N, Predio Cuncataca - Valle Chumbao - Andahuaylas',
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
        region: 'provincia',
        type: 'RTP',
        phone: '939063929',
        whatsapp: '51939063929',
    },
    {
        id: 6,
        name: 'Sede Ayacucho - Av. Cusco',
        // OSM: Avenida Cusco, San Juan Bautista. Número de puerta no disponible.
        position: [-13.1771520, -74.2002780],
        address: 'Av. Cusco 1633-1639, San Juan Bautista - Ayacucho, referencia curva Llama Gas',
        region: 'provincia',
        type: 'RTP',
        phone: '943431908',
        whatsapp: '51943431908',
    },
    {
        id: 7,
        name: 'Sede Ayacucho - Grifo Fénix',
        // OSM: Avenida Cusco, San Juan Bautista. Separada ~200 m de la sede 6.
        position: [-13.1761990, -74.2020590],
        address: 'Av. Cusco Nº 1250, a una cuadra del Grifo Fénix y al frente del Grifo San Miguelito - Ayacucho',
        region: 'provincia',
        type: 'RTP',
        phone: '908801161',
        whatsapp: '51908801161',
    },
];

/** Links de navegación derivados de dirección y coordenadas. */
export const branches: Branch[] = BRANCHES.map((b) => ({
    ...b,
    googleMapsUrl: mapsUrl(`${b.address}, Peru`),
    wazeUrl: wazeUrl(b.position),
}));
