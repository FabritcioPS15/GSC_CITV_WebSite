import { useState, useEffect, useRef, useMemo, type ReactNode } from 'react';
import { X, Menu, ChevronDown, ChevronRight, MapPin, Home, Users, FileText, Phone, Calendar, Search, FileCheck, Fuel, Tag, ExternalLink, ArrowRight } from 'lucide-react';
import PremiumButton from './PremiumButton';
import { Link, useLocation } from 'react-router-dom';
import { branches, branchSlug } from '../../backend/data/branches';
import { useBloqueoScroll } from '../hooks/useBloqueoScroll';
import { useMobileMenu } from '../context/MobileMenuContext';

/**
 * Una consulta puede ser un portal externo (el Estado lo tiene mejor mantido y
 * actualizado que una copia local) o una ruta del propio sitio. Nunca las dos:
 * si hay href gana el link externo.
 *
 * `portal` es el nombre que va en el aviso de "abriendo...", para que el usuario
 * sepa a qué sitio está saltando.
 */
interface ConsultaLink {
    label: string;
    icon: ReactNode;
    portal?: string;
    href?: string;
    path?: string;
}

export default function Header() {
    const { isOpen: mobileMenuOpen, setOpen: setMobileMenuOpen, toggle: toggleMobileMenu } = useMobileMenu();
    const [sedesDropdownOpen, setSedesDropdownOpen] = useState(false);
    const [mobileSedesOpen, setMobileSedesOpen] = useState(false);
    const [mobileRegion, setMobileRegion] = useState<'lima' | 'provincia'>('lima');
    const [isScrolled, setIsScrolled] = useState(false);
    const [portalAbierto, setPortalAbierto] = useState<string | null>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const location = useLocation();

    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const menuToggleRef = useRef<HTMLButtonElement | null>(null);
    const drawerCloseRef = useRef<HTMLButtonElement | null>(null);

    // Scroll effect for header with glassmorphism
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Desktop dropdown
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setSedesDropdownOpen(false);
            }

            // Mobile menu
            if (mobileMenuOpen && mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target as Node) &&
                !(event.target as HTMLElement).closest('[data-menu-toggle]')) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [mobileMenuOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setSedesDropdownOpen(false);
        setMobileSedesOpen(false);
    }, [location.pathname]);

    // Bloquea el scroll con el menú abierto.
    useBloqueoScroll(mobileMenuOpen);

    // Escape cierra el menú y devuelve el foco al botón, para que quien navega
    // con teclado no quede perdido. Al abrir, el foco entra al drawer.
    useEffect(() => {
        if (!mobileMenuOpen) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMobileMenuOpen(false);
                menuToggleRef.current?.focus();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        drawerCloseRef.current?.focus();
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [mobileMenuOpen, setMobileMenuOpen]);

    // Al reabrir el menú el acordeón de sedes arranca cerrado.
    useEffect(() => {
        if (!mobileMenuOpen) setMobileSedesOpen(false);
    }, [mobileMenuOpen]);

    const navLinks = useMemo(() => [
        { path: '/', label: 'Inicio', icon: <Home size={20} /> },
        { path: '/nosotros', label: 'Nosotros', icon: <Users size={20} /> },
        { path: '/cronograma', label: 'Cronograma', icon: <Calendar size={20} /> },
        { path: '/requisitos', label: 'Requisitos', icon: <FileText size={20} /> },
    ], []);

    const limaBranches = useMemo(() => branches.filter(branch => branch.region === 'lima'), []);
    const provinciaBranches = useMemo(() => branches.filter(branch => branch.region === 'provincia'), []);

    // Las consultas en linea solo vivian en el footer. Las de placa, revision y
    // gas apuntan al portal oficial del Estado, asi que van como link externo y
    // no como ruta interna. El cupon sí es del sitio.
    const consultaLinks = useMemo<ConsultaLink[]>(() => [
        {
            label: 'Consulta por Placa',
            icon: <Search size={17} />,
            portal: 'el portal de SUNARP',
            href: 'https://consultavehicular.sunarp.gob.pe/consulta-vehicular/inicio',
        },
        {
            label: 'Consulta de Revisión',
            icon: <FileCheck size={17} />,
            portal: 'el portal del MTC',
            href: 'https://rec.mtc.gob.pe/Citv/ArConsultaCitv',
        },
        {
            label: 'Inspección GLP / GNV',
            icon: <Fuel size={17} />,
            portal: 'el portal de Infogas',
            href: 'https://vh.infogas.com.pe/',
        },
        {
            label: 'Cupón de Descuento',
            icon: <Tag size={17} />,
            path: '/cupon',
        },
    ], []);

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    /**
     * Confirma la salida hacia un portal externo sin frenarla: el link se abre
     * igual, solo aparece un aviso que se va solo. Un cartel de "¿segurás?" acá
     * solo agregaria un paso, porque los portales son oficiales.
     */
    const avisarPortal = (nombre: string) => {
        if (toastTimer.current) clearTimeout(toastTimer.current);
        setPortalAbierto(nombre);
        toastTimer.current = setTimeout(() => setPortalAbierto(null), 3200);
    };

    // Si el Header se desmonta con el aviso en pantalla, el timer no debe
    // intentar setear estado en un componente muerto.
    useEffect(() => () => {
        if (toastTimer.current) clearTimeout(toastTimer.current);
    }, []);

    const isSedesActive = location.pathname.startsWith('/sedes');
    const contactoActive = location.pathname.startsWith('/contacto');

    const handleMobileSedesClick = () => {
        setMobileSedesOpen(!mobileSedesOpen);
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-xl' : ''}`}>
            {/* Header Principal */}
            <nav
                className={`transition-all duration-300 ${isScrolled
                    ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-200/80'
                    : 'bg-white border-b border-gray-100'
                    } ${isScrolled ? 'h-[75px]' : 'h-[90px]'}`}
            >
                <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-full">
                        {/* Logo */}
                        <div className="flex-shrink-0 animate-entry-slide-down">
                            <Link
                                to="/"
                                className="group block"
                            >
                                <img
                                    src="/LogoRTPSanCristobal_horizontal.png"
                                    alt="Grupo San Cristóbal Logo"
                                    className="h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation + Contáctanos, agrupados a la derecha */}
                        <div className="hidden xl:flex items-center h-full">
                            <div className="flex items-center h-full space-x-0">
                            {navLinks.slice(0, 2).map((link, index) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative group flex items-center h-full px-3.5 transition-colors duration-300 animate-entry-slide-down ${isActive(link.path)
                                        ? 'text-orange-500 font-semibold'
                                        : 'text-gray-800 hover:text-orange-500 font-medium'
                                        } ${index === 0 ? 'animate-stagger-1' : 'animate-stagger-2'}`}
                                >
                                    <span className="text-base relative py-0.5">
                                        {link.label}
                                        <span className={`absolute -bottom-1 left-0 h-[2px] bg-orange-500 transition-all duration-300 ease-out ${isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                                    </span>
                                </Link>
                            ))}

                            {/* Sedes Dropdown - Mega menú desktop */}
                            <div className="relative h-full flex items-center animate-entry-slide-down animate-stagger-3" ref={dropdownRef}>
                                <button
                                    onClick={() => setSedesDropdownOpen(!sedesDropdownOpen)}
                                    className={`relative group flex items-center h-full px-3.5 transition-colors duration-300 ${isSedesActive
                                        ? 'text-orange-500 font-semibold'
                                        : 'text-gray-800 hover:text-orange-500 font-medium'
                                        }`}
                                >
                                    <div className="flex items-center gap-1.5 relative py-0.5">
                                        <span className="text-base text-inherit">Sedes</span>
                                        <ChevronDown
                                            size={17}
                                            className={`transition-transform duration-300 ${sedesDropdownOpen ? 'rotate-180' : ''
                                                }`}
                                        />
                                        <span className={`absolute -bottom-1 left-0 h-[2px] bg-orange-500 transition-all duration-300 ease-out ${isSedesActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                                    </div>
                                </button>

                                {/* Dropdown Menu - Mega menú desktop */}
                                <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[760px] rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-200 bg-white ${sedesDropdownOpen
                                    ? 'opacity-100 scale-100 translate-y-0'
                                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                    }`}>
                                    <div className="grid grid-cols-3 gap-0 divide-x divide-gray-100">
                                        {/* Columna Lima */}
                                        <div className="p-5">
                                            <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-3 flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                                Sedes en Lima ({limaBranches.length})
                                            </p>
                                            <ul className="space-y-1 text-sm">
                                                {limaBranches.map(branch => (
                                                    <li key={branch.id}>
                                                        <Link
                                                            to={`/sedes/${branchSlug(branch)}`}
                                                            onClick={() => setSedesDropdownOpen(false)}
                                                            className="flex items-start gap-2.5 px-2.5 py-2 rounded-xl hover:bg-orange-50/60 transition-colors group"
                                                        >
                                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-400 group-hover:bg-orange-600 transition-colors flex-shrink-0" />
                                                            <div>
                                                                <p className="text-gray-900 text-sm font-medium group-hover:text-orange-600 transition-colors">{branch.name}</p>
                                                                <p className="text-xs text-gray-500 line-clamp-1">{branch.address}</p>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Columna Provincia */}
                                        <div className="p-5">
                                            <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-3 flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                                Sedes en Provincia ({provinciaBranches.length})
                                            </p>
                                            <ul className="space-y-1 text-sm">
                                                {provinciaBranches.map(branch => (
                                                    <li key={branch.id}>
                                                        <Link
                                                            to={`/sedes/${branchSlug(branch)}`}
                                                            onClick={() => setSedesDropdownOpen(false)}
                                                            className="flex items-start gap-2.5 px-2.5 py-2 rounded-xl hover:bg-orange-50/60 transition-colors group"
                                                        >
                                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-400 group-hover:bg-orange-600 transition-colors flex-shrink-0" />
                                                            <div>
                                                                <p className="text-gray-900 text-sm font-medium group-hover:text-orange-600 transition-colors">{branch.name}</p>
                                                                <p className="text-xs text-gray-500 line-clamp-1">{branch.address}</p>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Columna call-to-action */}
                                        <div className="p-5 bg-gradient-to-br from-orange-50 via-orange-100/40 to-white flex flex-col justify-between">
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">Encuentra tu centro</p>
                                                <p className="text-xs text-gray-600 mb-4 leading-relaxed">Ubica la sede autorizada más cercana, revisa tarifas, horarios y rutas de acceso.</p>
                                            </div>
                                            <Link
                                                to="/sedes#mapa"
                                                onClick={() => setSedesDropdownOpen(false)}
                                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-all duration-300 shadow-md shadow-orange-500/20"
                                            >
                                                <MapPin size={16} />
                                                <span>Ver todas las sedes</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Resto de enlaces */}
                            {navLinks.slice(2).map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative group flex items-center h-full px-3.5 transition-colors duration-300 ${isActive(link.path)
                                        ? 'text-orange-500 font-semibold'
                                        : 'text-gray-800 hover:text-orange-500 font-medium'
                                        }`}
                                >
                                    <span className="text-base relative py-0.5">
                                        {link.label}
                                        <span className={`absolute -bottom-1 left-0 h-[2px] bg-orange-500 transition-all duration-300 ease-out ${isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                                    </span>
                                </Link>
                            ))}
                            </div>

                            {/* Contact Desktop */}
                            <div className="flex items-center gap-4 pl-6 animate-entry-fade animate-stagger-4">
                                <PremiumButton to="/contacto" className="gap-2 !py-2.5 !px-5 text-sm">
                                    <Phone size={16} />
                                    <span>Contáctanos</span>
                                </PremiumButton>
                            </div>
                        </div>

                        {/* Tablet & Mobile Menu Button */}
                        <div className="xl:hidden">
                            <button
                                ref={menuToggleRef}
                                onClick={toggleMobileMenu}
                                data-menu-toggle
                                className="p-2 -mr-2 text-gray-700 hover:text-orange-600 transition-colors"
                                aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                                aria-expanded={mobileMenuOpen}
                            >
                                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                ref={mobileMenuRef}
                className={`xl:hidden fixed inset-0 z-50 transition-all duration-300 ${mobileMenuOpen
                    ? 'opacity-100 visible'
                    : 'opacity-0 invisible pointer-events-none'
                    }`}
            >
                {/* Backdrop con desenfoque suave. touch-action:none evita que al
                    arrastrar sobre el área vacía el dedo se lleve la página en
                    táctil; el drawer adentro sí scrollea porque es otro elemento. */}
                <div
                    className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 touch-none ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'
                        }`}
                    onClick={() => setMobileMenuOpen(false)}
                />

                {/* Mobile Drawer Panel */}
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Menú de navegación"
                    className={`absolute right-0 top-0 h-full w-full max-w-[300px] sm:max-w-[340px] bg-white shadow-2xl border-l border-gray-200 flex flex-col transform transition-transform duration-300 ease-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-white via-orange-50/30 to-white">
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block"
                        >
                            <img
                                src="/LogoRTPSanCristobal_horizontal.png"
                                alt="Grupo San Cristóbal Logo"
                                className="h-10 w-auto object-contain"
                            />
                        </Link>
                        <button
                            ref={drawerCloseRef}
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 -mr-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            aria-label="Cerrar menú"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Drawer Body - Con scroll suave */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                        {/* Enlaces Principales */}
                        <div className="space-y-1.5">
                            {navLinks.map((link) => {
                                const active = isActive(link.path);
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors duration-200 ${active
                                            ? 'bg-orange-500 text-white font-semibold'
                                            : 'bg-gray-50/80 text-gray-700 hover:bg-orange-50/60 hover:text-orange-600'
                                            }`}
                                    >
                                        <span className="flex items-center gap-3 min-w-0">
                                            <span className={active ? 'text-white' : 'text-orange-500'}>
                                                {link.icon}
                                            </span>
                                            <span className="text-base font-medium truncate">{link.label}</span>
                                        </span>
                                        <ChevronRight size={18} className={active ? 'text-white/80' : 'text-gray-300'} />
                                    </Link>
                                );
                            })}

                            {/* Sedes Accordion Interactivo */}
                            <div>
                                <button
                                    onClick={handleMobileSedesClick}
                                    aria-expanded={mobileSedesOpen}
                                    aria-controls="mobile-sedes-panel"
                                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors duration-200 ${isSedesActive
                                        ? 'bg-orange-500 text-white font-semibold'
                                        : 'bg-gray-50/80 text-gray-700 hover:bg-orange-50/60 hover:text-orange-600'
                                        }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <span className={isSedesActive ? 'text-white' : 'text-orange-500'}>
                                            <MapPin size={20} />
                                        </span>
                                        <span className="text-base font-medium">Nuestras Sedes</span>
                                    </span>
                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-200 ${mobileSedesOpen ? 'rotate-180' : ''} ${isSedesActive ? 'text-white' : 'text-gray-400'}`}
                                    />
                                </button>

                                {/* Contenido Sedes */}
                                {mobileSedesOpen && (
                                    <div id="mobile-sedes-panel" className="mt-1.5 p-2 bg-gray-50/90 rounded-xl border border-gray-200/80 space-y-2 animate-fade-in">
                                        {/* Botón ver todas las sedes. Apunta al ancla del mapa
                                            interactivo, no al inicio de la página, que arriba
                                            tiene el listado de sedes en tarjetas. */}
                                        <Link
                                            to="/sedes#mapa"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-semibold transition-colors"
                                        >
                                            <MapPin size={13} />
                                            <span>Ver mapa y las {branches.length} sedes</span>
                                            <ArrowRight size={13} />
                                        </Link>

                                        {/* Selector Lima / Provincias */}
                                        <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-200/70 rounded-xl">
                                            <button
                                                type="button"
                                                onClick={() => setMobileRegion('lima')}
                                                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${mobileRegion === 'lima'
                                                    ? 'bg-white text-orange-600 shadow-xs'
                                                    : 'text-gray-600 hover:text-gray-900'
                                                    }`}
                                            >
                                                Lima ({limaBranches.length})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setMobileRegion('provincia')}
                                                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${mobileRegion === 'provincia'
                                                    ? 'bg-white text-orange-600 shadow-xs'
                                                    : 'text-gray-600 hover:text-gray-900'
                                                    }`}
                                            >
                                                Provincias ({provinciaBranches.length})
                                            </button>
                                        </div>

                                        {/* Lista de sedes por región seleccionada */}
                                        <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
                                            {(mobileRegion === 'lima' ? limaBranches : provinciaBranches).map((branch) => (
                                                <Link
                                                    key={branch.id}
                                                    to={`/sedes/${branchSlug(branch)}`}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="flex items-center justify-between p-2 rounded-lg bg-white hover:bg-orange-50/80 border border-gray-200/60 transition-colors group"
                                                >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 group-hover:scale-125 transition-transform" />
                                                        <div className="truncate">
                                                            <p className="text-xs font-semibold text-gray-800 group-hover:text-orange-600 transition-colors truncate">
                                                                {branch.name}
                                                            </p>
                                                            <p className="text-[10px] text-gray-500 truncate">
                                                                {branch.address}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={14} className="text-gray-300 group-hover:text-orange-500 flex-shrink-0 ml-1" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Contáctanos entra como opción más de la lista, no como
                                botón aparte. El drawer se quedó sin el acceso a WhatsApp:
                                el de cada sede vive en su página y el general en el
                                botón flotante, que se oculta con el menú abierto. */}
                            <Link
                                to="/contacto"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors duration-200 ${contactoActive
                                    ? 'bg-orange-500 text-white font-semibold'
                                    : 'bg-gray-50/80 text-gray-700 hover:bg-orange-50/60 hover:text-orange-600'
                                    }`}
                            >
                                <span className="flex items-center gap-3">
                                    <span className={contactoActive ? 'text-white' : 'text-orange-500'}>
                                        <Phone size={20} />
                                    </span>
                                    <span className="text-base font-medium">Contáctanos</span>
                                </span>
                                <ChevronRight size={18} className={contactoActive ? 'text-white/80' : 'text-gray-300'} />
                            </Link>

                            {/* Consultas en línea, al final debajo de Contáctanos. Van en
                                dos columnas para no alargar la lista: son servicios
                                secundarios, no navegación principal. */}
                            <div className="pt-2">
                                <p className="px-1 pb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    Consultas en línea
                                </p>
                                <div className="grid grid-cols-2 gap-1.5">
                                    {consultaLinks.map((link) => {
                                        const externo = Boolean(link.href);
                                        // Un link externo nunca queda "activo": el usuario
                                        // sigue estando en este sitio, no en el portal.
                                        const active = externo ? false : isActive(link.path ?? '');
                                        const clases = `flex items-center gap-1.5 px-2.5 py-2.5 rounded-lg text-[11px] font-semibold leading-tight transition-colors ${active
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-gray-50/80 text-gray-700 hover:bg-orange-50/60 hover:text-orange-600'
                                            }`;
                                        const contenido = (
                                            <>
                                                <span className={active ? 'text-white' : 'text-orange-500'}>
                                                    {link.icon}
                                                </span>
                                                <span className="min-w-0">{link.label}</span>
                                            </>
                                        );

                                        if (externo) {
                                            return (
                                                <a
                                                    key={link.href}
                                                    href={link.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => link.portal && avisarPortal(link.portal)}
                                                    className={clases}
                                                >
                                                    {contenido}
                                                </a>
                                            );
                                        }

                                        return (
                                            <Link
                                                key={link.path}
                                                to={link.path ?? '/'}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={clases}
                                            >
                                                {contenido}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Drawer Footer. El banner reemplaza al texto de marca y también
                        al horario, que ya está en la barra de arriba del drawer.
                        Mide 10:1, así que a 200px de ancho queda en 20px de alto. */}
                    <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/80 flex items-center justify-end">
                        <img
                            src="/bannermtc.png"
                            alt="RTP & RTV San Cristóbal, autorizados por el MTC"
                            className="w-[200px] h-auto block shrink-0"
                        />
                    </div>

                </div>
            </div>

            {/* Aviso de salida a portal externo. Va por encima del drawer (z-60) y no
                intercepta clics, asi que el link se abre igual. */}
            {portalAbierto && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] pointer-events-none flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-white text-[13px] font-medium shadow-2xl animate-fade-in"
                >
                    <ExternalLink size={15} className="text-orange-400 shrink-0" />
                    <span className="whitespace-nowrap">Abriendo {portalAbierto}...</span>
                </div>
            )}
        </header>
    );
}

