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
 * Los móviles peruanos son 9 dígitos y empiezan con 9. Cualquier valor que no
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

export const branches: Branch[] = [
    // Lima Branches
    {
        id: 1,
        name: 'Sede RTP Callao',
        position: [-11.984339249713159, -77.12509328775818],
        address: 'Av. Nestor Gambeta cdra 1,2 y 3, Callao',
        region: 'lima',
        type: 'RTP',
        googleMapsUrl: 'https://maps.app.goo.gl/2khduJ8CDpCo8Bbr8',
        wazeUrl: 'https://waze.com/ul?ll=-11.984339249713159,-77.12509328775818&navigate=yes',
        placeId: 'ChIJN8tD5K5bZFIRRMjJ3jwLmAA', // Reemplazar con el placeId real
        phone: '(01) 123-4567',
        schedule: 'Lun - Sab: 7:00 - 20:00',
        image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        tarifario: {
            'part-automovil': 55,
            'pub-taxi': 75,
            'mer-liviano': 80,
            'mer-camion': 120,
            'pub-colectivo': 130,
        }
    },
    {
        id: 2,
        name: 'Sede RTP Canta Callao',
        position: [-11.96993651592964, -77.08508058845739],
        address: 'Av. Canta Callao 164, Los Olivos 15113',
        region: 'lima',
        type: 'RTV',
        googleMapsUrl: 'https://maps.app.goo.gl/7F72yS6adsvrjVoa7',
        wazeUrl: 'https://waze.com/ul?ll=-11.96993651592964,-77.08508058845739&navigate=yes',
        placeId: 'ChIJ4Y6uZj5bZFIRRMjJ3jwLmAA', // Reemplazar con el placeId real
        phone: '(01) 987-6543',
        schedule: 'Lun - Sab: 7:00 - 20:00',
        image: 'https://images.unsplash.com/photo-1632733711679-5292d6863f12?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        tarifario: {
            'part-automovil': 70,
            'pub-taxi': 80,
            'esp-motocicleta': 45,
        }
    },

    // Provincia Branches
    {
        id: 3,
        name: 'Sede RTP ICA',
        position: [-16.409047, -71.537451],
        address: 'Calle Mercaderes 101, Arequipa',
        region: 'provincia',
        type: 'RTP',
        phone: '(054) 123-456',
        schedule: 'Lun - Sab: 8:00 - 18:00',
        tarifario: {
            'part-automovil': 60,
            'pub-taxi': 70,
            'mer-camion': 110,
        }
    },
    {
        id: 4,
        name: 'Sede RTP Ayacucho',
        position: [-13.531950, -71.967463],
        address: 'Av. El Sol 202, Cusco',
        region: 'provincia',
        type: 'RTP',
        phone: '(084) 123-456',
        schedule: 'Lun - Sab: 8:00 - 17:00',
        tarifario: {
            'part-automovil': 60,
            'mer-camion': 115,
        }
    },
    {
        id: 5,
        name: 'Sede RTV Ayacucho',
        position: [-8.115990, -79.029980],
        address: 'Jr. Pizarro 303, Trujillo',
        region: 'provincia',
        type: 'RTV',
        phone: '(044) 123-456',
        schedule: 'Lun - Sab: 8:00 - 18:00',
        tarifario: {
            'esp-motocicleta': 40,
            'esp-menor': 35,
        }
    },
    {
        id: 6,
        name: 'Sede RTV Andahuaylas',
        position: [-8.115990, -79.029980],
        address: 'Jr. Pizarro 303, Trujillo',
        region: 'provincia',
        type: 'RTV',
        phone: '(044) 123-456',
        schedule: 'Lun - Sab: 8:00 - 18:00',
        tarifario: {
            'esp-motocicleta': 40,
            'esp-menor': 35,
        }
    },
    {
        id: 7,
        name: 'Sede RTP Huancavelica',
        position: [-8.115990, -79.029980],
        address: 'Jr. Pizarro 303, Trujillo',
        region: 'provincia',
        type: 'RTP',
        phone: '(044) 123-456',
        schedule: 'Lun - Sab: 8:00 - 18:00',
        tarifario: {
            'part-automovil': 60,
            'mer-camion': 110,
        }
    }
];
