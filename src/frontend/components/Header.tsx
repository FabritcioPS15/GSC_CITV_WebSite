import { useState, useEffect, useRef, useMemo } from 'react';
import { X, ChevronDown, ChevronRight, MapPin, Home, Users, FileText, Phone, Calendar, MessageCircle, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import PremiumButton from './PremiumButton';
import { Link, useLocation } from 'react-router-dom';
import { branches, WHATSAPP_INSPECCION, whatsappUrl } from '../../backend/data/branches';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [sedesDropdownOpen, setSedesDropdownOpen] = useState(false);
    const [mobileSedesOpen, setMobileSedesOpen] = useState(false);
    const [mobileRegion, setMobileRegion] = useState<'lima' | 'provincia'>('lima');
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

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
                !(event.target as HTMLElement).closest('button[aria-label="Toggle menu"]')) {
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

    // Disable body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const navLinks = useMemo(() => [
        { path: '/', label: 'Inicio', icon: <Home size={20} /> },
        { path: '/nosotros', label: 'Nosotros', icon: <Users size={20} /> },
        { path: '/cronograma', label: 'Cronograma', icon: <Calendar size={20} /> },
        { path: '/requisitos', label: 'Requisitos', icon: <FileText size={20} /> },
    ], []);

    const limaBranches = useMemo(() => branches.filter(branch => branch.region === 'lima'), []);
    const provinciaBranches = useMemo(() => branches.filter(branch => branch.region === 'provincia'), []);

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const isSedesActive = location.pathname.startsWith('/sedes');

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
                    <div className="flex justify-between xl:justify-center items-center h-full">
                        {/* Logo */}
                        <div className="flex-shrink-0 xl:absolute xl:left-8 animate-entry-slide-down">
                            <Link
                                to="/"
                                className="group block"
                            >
                                <img
                                    src="/LogoRTPSanCristobal_horizontal.png"
                                    alt="Grupo San Cristóbal Logo"
                                    className="h-11 md:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden xl:flex items-center h-full space-x-0">
                            {navLinks.slice(0, 2).map((link, index) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative group flex items-center h-full px-3.5 transition-colors duration-300 animate-entry-slide-down ${isActive(link.path)
                                        ? 'text-orange-500 font-semibold'
                                        : 'text-gray-800 hover:text-orange-500 font-medium'
                                        } ${index === 0 ? 'animate-stagger-1' : 'animate-stagger-2'}`}
                                >
                                    <span className="text-lg relative py-0.5">
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
                                        <span className="text-lg text-inherit">Sedes</span>
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
                                                            to={`/sedes/${branch.id}`}
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
                                                            to={`/sedes/${branch.id}`}
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
                                                to="/sedes"
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
                                    <span className="text-lg relative py-0.5">
                                        {link.label}
                                        <span className={`absolute -bottom-1 left-0 h-[2px] bg-orange-500 transition-all duration-300 ease-out ${isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                                    </span>
                                </Link>
                            ))}
                        </div>

                        {/* Contact Desktop */}
                        <div className="hidden xl:flex items-center gap-4 absolute right-8 animate-entry-fade animate-stagger-4">
                            <PremiumButton to="/contacto" className="gap-2 !py-3 !px-6 text-base">
                                <Phone size={18} />
                                <span>Contáctanos</span>
                            </PremiumButton>
                        </div>

                        {/* Tablet & Mobile Menu Button */}
                        <div className="xl:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className={`p-2.5 rounded-xl transition-all duration-300 border flex items-center justify-center ${mobileMenuOpen
                                    ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                                    : 'bg-orange-50 text-orange-600 border-orange-200/80 hover:bg-orange-100'
                                    }`}
                                aria-label="Toggle menu"
                            >
                                <div className="w-6 h-5 relative flex flex-col justify-between">
                                    <span className={`h-0.5 w-full rounded-full transition-all duration-300 ${mobileMenuOpen ? 'bg-white rotate-45 translate-y-[9px]' : 'bg-orange-600'}`} />
                                    <span className={`h-0.5 w-full rounded-full transition-all duration-200 ${mobileMenuOpen ? 'opacity-0' : 'bg-orange-600'}`} />
                                    <span className={`h-0.5 w-full rounded-full transition-all duration-300 ${mobileMenuOpen ? 'bg-white -rotate-45 -translate-y-[9px]' : 'bg-orange-600'}`} />
                                </div>
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
                {/* Backdrop con desenfoque suave */}
                <div
                    className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'
                        }`}
                    onClick={() => setMobileMenuOpen(false)}
                />

                {/* Mobile Drawer Panel */}
                <div
                    className={`absolute right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-white shadow-2xl border-l border-gray-200 flex flex-col transform transition-transform duration-300 ease-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
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
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 bg-gray-100/80 hover:bg-gray-200/80 transition-colors"
                            aria-label="Cerrar menú"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Drawer Body - Con scroll suave */}
                    <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                        {/* Status de atención rápido */}
                        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-orange-50/70 border border-orange-100 text-xs">
                            <div className="flex items-center gap-2 text-orange-950 font-medium">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>Atención Lun a Sáb: 7am - 6pm</span>
                            </div>
                            <span className="text-[11px] font-semibold text-orange-600 bg-white px-2 py-0.5 rounded-full border border-orange-200 shadow-xs">
                                12 Sedes
                            </span>
                        </div>

                        {/* Enlaces Principales */}
                        <div className="space-y-1.5">
                            {navLinks.map((link) => {
                                const active = isActive(link.path);
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ${active
                                            ? 'bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/20'
                                            : 'bg-gray-50/80 text-gray-700 hover:bg-orange-50/60 hover:text-orange-600 border border-gray-100/90'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded-lg ${active ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-600'}`}>
                                                {link.icon}
                                            </div>
                                            <span className="text-base font-medium">{link.label}</span>
                                        </div>
                                        <ChevronRight size={18} className={active ? 'text-white/80' : 'text-gray-400'} />
                                    </Link>
                                );
                            })}

                            {/* Sedes Accordion Interactivo */}
                            <div className="pt-1">
                                <button
                                    onClick={handleMobileSedesClick}
                                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ${isSedesActive
                                        ? 'bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/20'
                                        : 'bg-gray-50/80 text-gray-700 hover:bg-orange-50/60 hover:text-orange-600 border border-gray-100/90'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-lg ${isSedesActive ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-600'}`}>
                                            <MapPin size={20} />
                                        </div>
                                        <span className="text-base font-medium">Nuestras Sedes</span>
                                    </div>
                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-200 ${mobileSedesOpen ? 'rotate-180' : ''} ${isSedesActive ? 'text-white' : 'text-gray-400'}`}
                                    />
                                </button>

                                {/* Contenido Sedes */}
                                {mobileSedesOpen && (
                                    <div className="mt-2 p-3 bg-gray-50/90 rounded-2xl border border-gray-200/80 space-y-3 animate-fade-in">
                                        {/* Botón ver todas las sedes */}
                                        <Link
                                            to="/sedes"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-sm transition-all"
                                        >
                                            <MapPin size={14} />
                                            <span>Ver mapa y las 12 sedes</span>
                                            <ArrowRight size={14} />
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
                                        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                                            {(mobileRegion === 'lima' ? limaBranches : provinciaBranches).map((branch) => (
                                                <Link
                                                    key={branch.id}
                                                    to={`/sedes/${branch.id}`}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-orange-50/80 border border-gray-200/60 transition-colors group"
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
                        </div>

                        {/* Botones de Acción Directa */}
                        <div className="pt-2 space-y-2">
                            {/* WhatsApp Directo */}
                            <a
                                href={whatsappUrl(WHATSAPP_INSPECCION, 'Hola, deseo realizar una consulta sobre la revisión técnica vehicular.')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all"
                            >
                                <MessageCircle size={18} />
                                <span>Consultar por WhatsApp</span>
                            </a>

                            {/* Contacto */}
                            <Link
                                to="/contacto"
                                onClick={() => setMobileMenuOpen(false)}
                                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm shadow-md shadow-orange-500/20 active:scale-[0.98] transition-all"
                            >
                                <Phone size={18} />
                                <span>Contáctanos</span>
                            </Link>
                        </div>

                        {/* Tarjeta de Garantía / Requisitos rápidos */}
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 space-y-2">
                            <div className="flex items-center gap-1.5 font-bold text-slate-800">
                                <ShieldCheck size={16} className="text-orange-500" />
                                <span>Centro Autorizado MTC</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-slate-500">
                                Certificado oficial con validez nacional e informe de inspección inmediato.
                            </p>
                        </div>
                    </div>

                    {/* Drawer Footer */}
                    <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50/80 text-[11px] text-gray-500 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                            <Clock size={12} className="text-orange-500" />
                            <span>Lun - Sáb: 7am a 6pm</span>
                        </span>
                        <span className="font-medium text-gray-700">RTP & RTV San Cristóbal</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

