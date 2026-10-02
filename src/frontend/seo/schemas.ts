import {
    SITE_NAME,
    SITE_URL,
    SITE_TAGLINE,
    OG_IMAGE,
    LOGO,
    EMAIL_CONTACTO,
    TELEFONO_CONTACTO,
    url
} from './config';
import { branches, branchHref } from '../../backend/data/branches';
import { socialLinks } from '../../backend/data/social';

/**
 * Datos estructurados de schema.org.
 *
 * Viven aparte del componente `Seo` a propósito: mezclar exports de datos con
 * exports de componentes rompe el fast refresh de Vite en desarrollo.
 */

/** Sede usada como dirección principal del negocio (la central). */
const principal = branches[0];

/** Teléfono de una sede en formato internacional. */
function telefonoSede(phone?: string): string {
    return phone ? `+51 ${phone}` : TELEFONO_CONTACTO;
}

/** La última coma de la dirección suele ser la ciudad o el distrito. */
function ciudadDe(address: string): string {
    return address.split(',').pop()?.trim() ?? address;
}

/** Redondea a 6 decimales: Google ignora más precisión y evita ruido. */
function round6(n: number): number {
    return Math.round(n * 1e6) / 1e6;
}

/**
 * Nodo principal del grafo local de Google: habilita el panel con dirección,
 * horarios y reseñas. `AutomotiveBusiness` hereda de `LocalBusiness`.
 */
export const schemaNegocio: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'AutomotiveBusiness',
    '@id': `${SITE_URL}/#negocio`,
    name: `${SITE_NAME} · ${SITE_TAGLINE}`,
    legalName: SITE_NAME,
    description:
        'Centro de revisión técnica vehicular autorizado por el MTC en el Perú. Inspección técnica de vehículos livianos y pesados con equipos calibrados y certificación oficial.',
    url: SITE_URL,
    logo: LOGO,
    image: OG_IMAGE,
    telephone: TELEFONO_CONTACTO,
    email: EMAIL_CONTACTO,
    priceRange: '$$',
    currenciesAccepted: 'PEN',
    address: {
        '@type': 'PostalAddress',
        streetAddress: principal.address,
        addressLocality: 'Callao',
        addressRegion: 'Lima',
        addressCountry: 'PE'
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: round6(principal.position[0]),
        longitude: round6(principal.position[1])
    },
    hasMap: principal.googleMapsUrl,
    openingHoursSpecification: [
        {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '07:00',
            closes: '19:00'
        },
        {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '08:00',
            closes: '17:00'
        }
    ],
    areaServed: { '@type': 'Country', name: 'Perú' },
    sameAs: socialLinks.map(s => s.url),
    hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Servicios de inspección técnica vehicular',
        itemListElement: [
            'Inspección técnica de vehículos livianos',
            'Inspección técnica de vehículos pesados',
            'Certificados especiales de operatividad',
            'Certificación vehicular de gas GNV y GLP'
        ].map(servicio => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: servicio }
        }))
    }
};

/**
 * Todas las sedes como nodos del grafo local, con dirección, teléfono y
 * coordenadas reales. Alimenta la búsqueda "revisión técnica cerca de mí".
 */
export const schemaSedes: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Sedes de Grupo San Cristóbal',
    numberOfItems: branches.length,
    itemListElement: branches.map((sede, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
            '@type': 'AutomotiveBusiness',
            '@id': `${SITE_URL}${branchHref(sede)}#negocio`,
            name: `${SITE_NAME} · ${sede.name}`,
            url: `${SITE_URL}${branchHref(sede)}`,
            telephone: telefonoSede(sede.phone),
            address: {
                '@type': 'PostalAddress',
                streetAddress: sede.address,
                addressLocality: ciudadDe(sede.address),
                addressCountry: 'PE'
            },
            geo: {
                '@type': 'GeoCoordinates',
                latitude: round6(sede.position[0]),
                longitude: round6(sede.position[1])
            },
            hasMap: sede.googleMapsUrl,
            parentOrganization: { '@id': `${SITE_URL}/#negocio` }
        }
    }))
};

/**
 * Schema de una sede concreta, para su página de detalle. Debe llevar el mismo
 * `@id` que su entrada en `schemaSedes`, así Google los fusiona en un nodo.
 */
export function schemaSede(sedeId: number): Record<string, unknown> {
    const sede = branches.find(b => b.id === sedeId);
    if (!sede) return schemaNegocio;

    return {
        '@context': 'https://schema.org',
        '@type': 'AutomotiveBusiness',
        '@id': `${SITE_URL}${branchHref(sede)}#negocio`,
        name: `${SITE_NAME} · ${sede.name}`,
        url: `${SITE_URL}${branchHref(sede)}`,
        telephone: telefonoSede(sede.phone),
        logo: LOGO,
        image: OG_IMAGE,
        address: {
            '@type': 'PostalAddress',
            streetAddress: sede.address,
            addressLocality: ciudadDe(sede.address),
            addressCountry: 'PE'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: round6(sede.position[0]),
            longitude: round6(sede.position[1])
        },
        hasMap: sede.googleMapsUrl,
        parentOrganization: { '@id': `${SITE_URL}/#negocio` }
    };
}

/** Preguntas frecuentes como `FAQPage`: resultado enriquecido con desplegables. */
export function schemaFaq(faqs: { q: string; a: string }[]): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
    };
}

/** Migas de pan para la navegación de Google. */
export function schemaBreadcrumbs(
    items: { name: string; path: string }[]
): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: url(item.path)
        }))
    };
}