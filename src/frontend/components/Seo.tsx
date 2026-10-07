import { Helmet } from 'react-helmet-async';
import {
    SITE_NAME,
    OG_IMAGE,
    KEYWORDS_PRINCIPALES,
    url,
    type PageSeo
} from '../seo/config';

/**
 * Aplica el SEO de una página: title, description, canonical, Open Graph,
 * Twitter Card y JSON-LD.
 *
 * Todas las páginas deben usar este componente en lugar de escribir su propio
 * bloque `<Helmet>`, para que el dominio, el formato del title y la imagen
 * social sean siempre los mismos.
 *
 * Los schemas viven en `seo/schemas.ts`.
 */
export default function Seo({
    path,
    title,
    description,
    keywords,
    ogImage,
    schema,
    noindex
}: PageSeo) {
    const canonical = url(path);
    const imagen = ogImage ?? OG_IMAGE;
    const tags = keywords?.length ? keywords : KEYWORDS_PRINCIPALES;

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={tags.join(', ')} />
            <meta name="author" content={SITE_NAME} />
            <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow'} />
            {/* Una página noindex no debe declarar canonical: la canonical apunta
                a otra URL y Google la usaría como señal de consolidación. */}
            {!noindex && <link rel="canonical" href={canonical} />}

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:locale" content="es_PE" />
            <meta property="og:url" content={canonical} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imagen} />
            <meta property="og:image:alt" content={title} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonical} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imagen} />

            {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
        </Helmet>
    );
}