/**
 * Configuración central de SEO.
 *
 * Antes cada página escribía su propio `<Helmet>` con el dominio de ejemplo
 * `tu-dominio.com`, lo que dejaba canonicals rotas y titles inconsistentes.
 * Ahora todo sale de acá.
 *
 * Los datos de contacto NO se redefinen aquí: se importan de
 * `backend/data/contacto.ts` para respetar la fuente única de verdad.
 */

import { EMAIL_CONTACTO, TELEFONO_CONTACTO } from '../../backend/data/contacto';

export const SITE_URL = 'https://gruposancristobal.pe';

/** Nombre corto de la marca, para Open Graph y titles. */
export const SITE_NAME = 'Grupo San Cristóbal';

/** Lema principal: es lo que la gente busca ("revisiones técnicas"). */
export const SITE_TAGLINE = 'Revisión Técnica Vehicular en el Perú';

/**
 * Imagen social por defecto.
 *
 * Es un lienzo de 1200x630 generado a partir del logo sobre el fondo negro de
 * marca. No se puede usar el logo directo (`LogoRTPSanCristobal_horizontal.png`)
 * porque mide 5625x1438: Facebook y Twitter recortan las imágenes muy
 * panorámicas y además pesa 2.5 MB.
 */
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

/**
 * Logo real de la empresa, para `schema.org/logo` y el favicon del knowledge
 * panel. Google lo muestra en tamaños chicos, así que conviene el logo pelado y
 * no la imagen social con relleno.
 */
export const LOGO = `${SITE_URL}/LogoRTPSanCristobal_horizontal.png`;

export { EMAIL_CONTACTO, TELEFONO_CONTACTO };

/**
 * Keywords principales.
 *
 * Nota: Google ignora este meta tag desde 2009. Se mantiene por documentación
 * y para buscadores secundarios, pero el peso real está en el title, la
 * description, el H1 y el contenido.
 */
export const KEYWORDS_PRINCIPALES = [
    'revisión técnica',
    'revisión técnica vehicular',
    'revisiones técnicas',
    'RTP',
    'RTV',
    'RTP San Cristóbal',
    'grupo san cristobal',
    'inspección técnica vehicular',
    'centro de revisión técnica',
    'revisión técnica Lima',
    'revisión técnica Callao',
    'revisión técnica Perú',
    'certificado de inspección vehicular',
    'inspección vehicular MTC'
] as const;

/** Construye una URL absoluta a partir de la ruta interna. */
export function url(path: string): string {
    if (!path || path === '/') return `${SITE_URL}/`;
    return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export interface PageSeo {
    /** Path interno, por ejemplo `/sedes`. Se usa para la canonical. */
    path: string;
    title: string;
    description: string;
    keywords?: readonly string[];
    /** Ruta o URL de la imagen para OG. Por defecto, el logo horizontal. */
    ogImage?: string;
    /** Objeto schema.org para el JSON-LD de la página. */
    schema?: Record<string, unknown>;
    /** Marcar como no indexable (404). El contenido legal sí se indexa. */
    noindex?: boolean;
}