import { useParams, Navigate } from 'react-router-dom';
import { findBranch, branchSlug, branchHref } from '../../backend/data/branches';
import { MapPin, Phone, ArrowRight, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { SiGooglemaps, SiWaze } from 'react-icons/si';
import SimpleBranchMap from '../components/SimpleBranchMap';
import RevealOnScroll from '../components/RevealOnScroll';
import { useEffect, useState } from 'react';
import { scrollToTop } from '../components/SmoothScroll';
import Tarifico from '../components/Tarifico';
import GalleryCarousel from '../components/GalleryCarousel';
import { getGaleria } from '../../backend/data/galeria';
import { EMAIL_CONTACTO } from '../../backend/data/contacto';
import ServicioModal from '../components/ServicioModal';
import Seo from '../components/Seo';
import { schemaSede } from '../seo/schemas';

/** Servicios de inspección que ofrece cada sede, con el detalle que abre el popup. */
const SERVICIOS_SEDE = [
    {
        id: 'livianos',
        titulo: 'Vehículos Livianos',
        imagen: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800',
        resumen: 'Autos, camionetas y SUV con tiempo estimado de proceso de menos de 20 minutos.',
        detalle:
            'Revisión técnica vehicular para vehículos livianos, registrada en el sistema del MTC y con entrega del certificado oficial en el acto. El proceso se realiza con líneas calibradas y sin que tengas que salir del vehículo.',
        incluye: [
            'Inspección de luces y elementos de señalización',
            'Frenos, suspensión y dirección',
            'Medición de emisiones de gases',
            'Neumáticos y estado general del vehículo',
            'Entrega del certificado oficial MTC'
        ]
    },
    {
        id: 'pesados',
        titulo: 'Vehículos Pesados',
        imagen: 'https://images.unsplash.com/photo-1586191582151-f70351799633?q=80&w=800',
        resumen: 'Camiones, buses y transporte de carga especializado hasta 12 toneladas.',
        detalle:
            'Inspección para camiones, buses y unidades de carga. Contamos con plataforma para vehículos pesados y personal capacitado en la normativa vigente.',
        incluye: [
            'Inspección de frenos y suspensión reforzada',
            'Control de ejes y peso permitido',
            'Medición de emisiones para motor diésel',
            'Verificación de elementos de seguridad',
            'Entrega del certificado oficial MTC'
        ]
    },
    {
        id: 'especiales',
        titulo: 'Certificados Especiales',
        imagen: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800',
        resumen: 'Modificaciones, bonificaciones por neumáticos y certificados de operatividad.',
        detalle:
            'Emitimos los certificados especiales que requieren unidades con modificaciones o condiciones particulares, evaluando cada caso según lo establecido por el MTC.',
        incluye: [
            'Certificado de operatividad para transporte público',
            'Bonificaciones por uso de neumáticos',
            'Modificaciones de estructura o carrocería',
            'Verificación de equipos de seguridad',
            'Acompañamiento del trámite ante el MTC'
        ]
    }
];

type ServicioSede = (typeof SERVICIOS_SEDE)[number];

/**
 * En móvil los servicios se muestran de a uno. En lugar de un carrusel con
 * scroll horizontal, se muestra solo la tarjeta activa y se cambia con las
 * flechas o los puntos inferiores.
 */
function ServiciosCarousel({
    servicios,
    onMasInfo
}: {
    servicios: readonly ServicioSede[];
    onMasInfo: (servicio: ServicioSede) => void;
}) {
    const [activo, setActivo] = useState(0);
    const total = servicios.length;

    const ir = (i: number) => setActivo((i + total) % total);
    const servicio = servicios[activo];

    return (
        <div>
            <div className="relative">
                <div
                    key={servicio.id}
                    className="group relative h-[450px] rounded-[40px] overflow-hidden shadow-2xl shadow-black/5 animate-entry-fade"
                >
                    <img
                        src={servicio.imagen}
                        alt={servicio.titulo}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                    <div className="absolute bottom-12 left-8 right-8 text-white">
                        <h3 className="text-2xl font-black mb-3">{servicio.titulo}</h3>
                        <p className="content-text text-gray-300 mb-6">{servicio.resumen}</p>
                        <button
                            onClick={() => onMasInfo(servicio)}
                            className="flex items-center gap-2 font-black text-[11px] uppercase tracking-widest hover:gap-3 transition-all"
                        >
                            Más Información <ArrowRight size={16} />
                        </button>
                    </div>
                </div>

                {total > 1 && (
                    <>
                        <button
                            onClick={() => ir(activo - 1)}
                            aria-label="Servicio anterior"
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white active:scale-95 transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => ir(activo + 1)}
                            aria-label="Siguiente servicio"
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white active:scale-95 transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}
            </div>

            {/* Puntos de posición */}
            <div className="mt-6 flex items-center justify-center gap-2">
                {servicios.map((s, i) => (
                    <button
                        key={s.id}
                        onClick={() => setActivo(i)}
                        aria-label={`Ver ${s.titulo}`}
                        aria-current={i === activo}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            i === activo ? 'w-8 bg-[#f97316]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}


function SedeDetalle() {
    const { slug } = useParams<{ slug: string }>();
    const branch = findBranch(slug);
    const [servicioAbierto, setServicioAbierto] = useState<ServicioSede | null>(null);

    useEffect(() => {
        scrollToTop();
    }, [slug]);

    // URL antigua con id numérico (ej. /sedes/3): se redirige al slug para no
    // perder los enlaces ya indexados ni los que el usuario tenga guardados.
    const slugActual = branch ? branchSlug(branch) : null;
    if (branch && slug !== slugActual) {
        return <Navigate to={branchHref(branch)} replace />;
    }

    if (!branch) {
        return <Navigate to="/sedes" replace />;
    }

    const emailContacto = EMAIL_CONTACTO;
    const ciudad = branch.address.split(',').pop()?.trim() ?? '';
    const sedeNombre = branch.name.replace('Sede RTP ', '').replace('Sede RTV ', '');

    return (
        <div className="min-h-screen bg-white">
            <Seo
                path={branchHref(branch)}
                title={`Revisión Técnica en ${sedeNombre} | ${ciudad} | Grupo San Cristóbal`}
                description={`Centro de revisión técnica vehicular autorizado por el MTC en ${sedeNombre}, ${ciudad}. Inspección de vehículos livianos y pesados, certificado oficial, dirección ${branch.address}. Agenda tu cita por WhatsApp.`}
                keywords={[`revisión técnica ${sedeNombre}`, `revisión técnica ${ciudad}`, `RTP ${sedeNombre}`, 'inspección técnica vehicular cerca']}
                schema={schemaSede(branch.id)}
            />
            {/* HERO SECTION - ADAPTADO CON ESTÉTICA PREMIUM */}
            <section className="page-banner w-full">
                {/* Cuadriláteros de fondo y máscara de imagen adaptativos */}
                <div className="absolute inset-0 z-0">
                    {/* Fondo Gris Claro (Decorativo) */}
                    <div className="absolute top-0 right-0 w-[48%] h-full bg-gray-50 transform skew-x-[-15deg] translate-x-12" />

                    {/* Acento de malla decorativa para móvil */}
                    <div className="md:hidden absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.1),transparent_50%)]" />

                    {/* Cuadrilátero de contorno (Ghost shape) */}
                    <div className="absolute top-0 right-0 w-[48%] h-full border-l-[1px] border-orange-500/30 transform skew-x-[-15deg] translate-x-6 opacity-40" />

                    {/* Acentos decorativos - Responsivos */}
                    <div className="absolute top-0 right-[42%] w-1.5 h-full bg-orange-500/10 transform skew-x-[-15deg]" />
                    <div className="absolute bottom-6 right-[45%] w-32 h-1 bg-orange-500 transform skew-x-[-15deg] shadow-[0_0_20px_rgba(249,115,22,0.6)]" />

                    {/* Contenedor de Imagen: Animación separada del Skew */}
                    <div className="absolute top-0 right-0 w-full md:w-[45%] h-full z-0 animate-entry-slide-left">
                        <div className="absolute inset-0 md:transform md:skew-x-[-15deg] md:translate-x-20 overflow-hidden md:border-l-[8px] md:border-[#f97316] shadow-[-20px_0_50px_rgba(0,0,0,0.4)]">
                            <div className="absolute inset-0 md:transform md:skew-x-[15deg] md:-translate-x-24 scale-150">
                                <img
                                    src={branch.image ?? 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80'}
                                    className="w-full h-full object-cover opacity-40 md:opacity-90 saturate-[1.2]"
                                    alt={branch.image ? `Foto de la ${branch.name}` : 'Vehículo en inspección'}
                                />
                                {/* Capas de color adaptativas */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 md:via-black/60 to-transparent md:to-transparent" />
                                <div className="absolute inset-0 bg-[#f97316]/5 mix-blend-overlay" />
                            </div>
                        </div>
                    </div>

                    {/* Brillo decorativo naranja (Responsivo) */}
                    <div className="absolute top-0 right-0 w-1 md:w-2 h-full bg-[#f97316] transform md:skew-x-[-15deg] md:translate-x-[400px] shadow-[0_0_40px_rgba(249,115,22,0.9)]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
                    {/* Texto Informativo Adaptado - Muy compacto en móvil */}
                    <div className="flex items-center gap-4 md:gap-8">
                        {/* Barra decorativa vertical naranja (Más pequeña en móvil) */}
                        <div className="w-1.5 h-20 bg-orange-500 rounded-full shrink-0 shadow-[0_0_25px_rgba(249,115,22,0.6)] animate-grow-vertical" />

                        <div className="text-white max-w-2xl">
                            <h1 className="banner-title text-white animate-grow-text">
                                {branch.name.split(' ').map((word, idx, arr) => (
                                    <span key={idx} className={idx === arr.length - 1 ? 'text-[#f97316]' : 'text-white'}>
                                        {word}{' '}
                                    </span>
                                ))}
                            </h1>

<p className="banner-description text-gray-400 max-w-lg mt-5 animate-entry-fade animate-stagger-3">
                                Guía completa y atención especializada para aprobar tu inspección vehicular sin contratiempos.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Decorative Detail */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-orange-500/0 to-transparent opacity-50" />
            </section>

            {/* SERVICIOS SECTION */}
            <section className="section max-w-7xl mx-auto px-4">
                <div className="flex items-start gap-6 mb-14">
                    <div className="w-1.5 h-20 bg-[#f97316] rounded-full shrink-0" />
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 mb-5 tracking-tight uppercase">
                            Servicios de <span className="text-[#f97316]">Inspección</span>
                        </h2>
                        <p className="content-text text-gray-500 max-w-2xl">
                            Nuestra sede en {branch.name.replace('Sede RTP ', '').replace('Sede RTV ', '')} equipada con tecnología de última generación para procesar todo tipo de certificaciones técnicas vigentes.
                        </p>
                    </div>
                </div>

                {/* Móvil: un servicio a la vez. Escritorio: las tres columnas. */}
                <div className="md:hidden">
                    <ServiciosCarousel servicios={SERVICIOS_SEDE} onMasInfo={setServicioAbierto} />
                </div>

                <div className="hidden md:grid grid-cols-3 gap-8">
                    {SERVICIOS_SEDE.map((servicio, i) => (
                        <RevealOnScroll key={servicio.id} className={`delay-${(i + 1) * 100}`}>
                            <div className="group relative h-[450px] rounded-[40px] overflow-hidden shadow-2xl shadow-black/5 hover:shadow-orange-500/10 transition-all duration-500">
                                <img
                                    src={servicio.imagen}
                                    alt={servicio.titulo}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                <div className="absolute bottom-12 left-10 right-10 text-white">
                                    <h3 className="text-2xl font-black mb-3">{servicio.titulo}</h3>
                                    <p className="content-text text-gray-300 mb-6">{servicio.resumen}</p>
                                    <button
                                        onClick={() => setServicioAbierto(servicio)}
                                        className="flex items-center gap-2 font-black text-[11px] uppercase tracking-widest hover:gap-3 transition-all"
                                    >
                                        Más Información <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </RevealOnScroll>
                    ))}
                </div>
            </section>

            {/* TARIFAS SECTION */}
            <section className="section bg-black">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-start gap-6 mb-14">
                        <div className="w-1.5 h-20 bg-[#f97316] rounded-full shrink-0" />
                        <div>
                            <h2 className="text-4xl font-black text-white mb-5 tracking-tight uppercase">
                                Tarifas y <span className="text-[#f97316]">Costos</span>
                            </h2>
                            <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
                                Precios competitivos y transparentes para garantizar la seguridad de su vehículo. Todas las tarifas incluyen impuestos y certificaciones oficiales.
                            </p>
                        </div>
                    </div>

                    {/* Alto fijo en escritorio: cambiar de categoría con más o menos
                        vehículos ya no debe cambiar el tamaño de la sección. */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:h-[32rem]">
                        <RevealOnScroll className="h-full">
                            <Tarifico
                                sedeId={branch.id}
                                sedeNombre={branch.name}
                                whatsapp={branch.whatsapp}
                            />
                        </RevealOnScroll>

                        <RevealOnScroll className="h-full delay-200">
                            <GalleryCarousel
                                imagenes={getGaleria(branch.galeria)}
                                titulo={`Galería · ${branch.name}`}
                            />
                        </RevealOnScroll>
                    </div>
                </div>
            </section>

            {/* INFO GRID SECTION */}
            <section className="section max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Column 1: Info Operativa */}
                    <RevealOnScroll>
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-8 bg-[#f97316] rounded-full" />
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
                                    Información <span className="text-[#f97316]">Operativa</span>
                                </h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-medium">Lunes - Viernes</span>
                                    <span className="text-gray-900 font-black">07:00 - 19:00</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-medium">Sábados</span>
                                    <span className="text-gray-900 font-black">08:00 - 17:00</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-medium">Domingos</span>
                                    <span className="text-red-500 font-black uppercase">Cerrado</span>
                                </div>
                            </div>

                            <div className="mt-8 space-y-3">
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-xl group">
                                    <div className="bg-white p-2.5 rounded-lg text-orange-600 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">CELULAR</p>
                                        <p className="text-sm font-black text-gray-900">{branch.phone || '(024) 123-456'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-xl group">
                                    <div className="bg-white p-2.5 rounded-lg text-orange-600 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all">
                                        <Mail size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">EMAIL CONSULTAS</p>
                                        <a
                                            href={`mailto:${emailContacto}`}
                                            className="block text-sm font-black text-gray-900 break-words hover:text-orange-600 transition-colors"
                                        >
                                            {emailContacto}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>

                    {/* Column 2: Ubicación */}
                    <RevealOnScroll className="delay-200">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-8 bg-[#f97316] rounded-full" />
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
                                    Ubicación y <span className="text-[#f97316]">Contacto</span>
                                </h3>
                            </div>
                            <div className="overflow-hidden h-[180px] mb-6">
                                <SimpleBranchMap branch={branch} />
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-orange-100 p-2 rounded-lg text-orange-600 mt-0.5">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-900 mb-1">{branch.name}</p>
                                    <p className="text-sm text-gray-500 leading-relaxed">{branch.address}</p>
                                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4">
                                        <a
                                            href={branch.googleMapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-orange-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                                        >
                                            <SiGooglemaps className="text-sm" />
                                            Ver en Google Maps
                                        </a>
                                        <a
                                            href={branch.wazeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#33ccff] hover:text-[#1a9fd4] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                                        >
                                            <SiWaze className="text-sm" />
                                            Ver en Waze
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </section>

            {servicioAbierto && (
<ServicioModal
                          titulo={servicioAbierto.titulo}
                          imagen={servicioAbierto.imagen}
                          detalle={servicioAbierto.detalle}
                          incluye={servicioAbierto.incluye}
                          sedeNombre={branch.name}
                          whatsapp={branch.whatsapp}
                          onClose={() => setServicioAbierto(null)}
                      />
            )}
        </div>
    );
}

export default SedeDetalle;
