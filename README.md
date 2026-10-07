# RTP / RTV San Cristóbal

Sitio web oficial de **Grupo San Cristóbal**, empresa peruana de Revisión Técnica Vehicular (RTP/RTV) autorizada por el MTC. Web institucional en español para dar a conocer sus sedes de inspección vehicular en Lima y provincias, tarifas, requisitos y cronogramas.

## Descripción

Proyecto frontend que presenta la información de las sedes de Grupo San Cristóbal (Callao, Canta, Ica, Andahuaylas, Huancavelica, Ayacucho), su tarifario por categoría de vehículo, requisitos, contacto y herramientas de consulta (placa, revisión y gas con datos simulados que enlazan a portales externos como SUNARP, MTC CITV e InfoGas).

## Características

- 16 rutas con lazy loading (Inicio, Nosotros, Sedes, Requisitos, Contacto, Cronograma, Cupón, Consultas, páginas legales y 404).
- Mapa de sedes con Leaflet/OpenStreetMap y navegación a Google Maps y Waze.
- Tarifario por categoría de vehículo (particular, público, mercancías, residuos peligrosos, especiales).
- Botón flotante de WhatsApp con selector de sede/región.
- SEO optimizado: react-helmet-async, metas OG/Twitter, JSON-LD, sitemap.xml y robots.txt.
- UX con animaciones: scroll suave (Lenis), transiciones de página, reveal on scroll, carruseles y loader.
- Gestión de consentimiento de cookies con preferencias guardadas en localStorage.
- Diseño responsive con menú móvil.

## Stack Tecnológico

| Categoría | Tecnologías |
|---|---|
| Framework | React 18 + TypeScript 5.5 |
| Build | Vite 5 |
| Routing | react-router-dom 7 |
| Estilos | Tailwind CSS 3.4 |
| Mapas | leaflet + react-leaflet |
| SEO | react-helmet-async |
| Iconos | lucide-react, react-icons |
| Animaciones | lenis, react-intersection-observer |
| Lint | ESLint 9 + typescript-eslint |
| Hosting | Apache (.htaccess) |

## Estructura

```
RTP-RTV-San-Cristobal/
├── index.html              # HTML raíz con metas SEO + JSON-LD
├── package.json            # dependencias y scripts
├── vite.config.ts          # Vite + plugin React
├── tailwind.config.js      # tema Tailwind
├── eslint.config.js
├── public/                 # assets estáticos (imágenes, robots.txt, sitemap.xml, .htaccess)
│   └── WEB FOTOS/          # fotos reales por sede
├── dist/                   # build de producción
└── src/
    ├── main.tsx            # punto de entrada
    ├── App.tsx             # router + layout global (Header/Footer/WhatsApp/Cookies)
    ├── backend/            # datos estáticos en TS (sedes, tarifario, contacto, galería)
    └── frontend/
        ├── components/     # componentes UI (Header, Footer, SedesMap, consultas, carruseles...)
        ├── pages/          # 16 páginas
        ├── context/        # MobileMenuContext
        ├── hooks/          # useCarrusel, useBloqueoScroll
        ├── seo/            # config SEO + schemas JSON-LD
        ├── styles/         # index.css (Tailwind)
        └── utils/          # consent.ts
```

## Scripts

```bash
npm install      # instalar dependencias
npm run dev      # desarrollo
npm run build    # build de producción
npm run lint     # lint
npm run typecheck # verificación de tipos
```
