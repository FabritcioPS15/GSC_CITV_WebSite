import React, { useMemo } from 'react';
import { 
  Facebook, 
  Instagram, 
  Music2, 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  ChevronRight, 
  ShieldCheck, 
  Ticket
} from 'lucide-react';
import { Link } from 'react-router-dom';
import RevealOnScroll from './RevealOnScroll';
import { socialLinks } from '../../backend/data/social';

export default function Footer() {
  const quickLinks = useMemo(() => [
    { path: '/', label: 'Inicio' },
    { path: '/nosotros', label: 'Nosotros' },
    { path: '/sedes', label: 'Nuestras Sedes' },
    { path: '/cronograma', label: 'Cronograma MTC' },
    { path: '/requisitos', label: 'Requisitos de Inspección' },
    { path: '/cupon', label: 'Cupón de Descuento (S/ 10)' },
  ], []);

  const serviceLinks = useMemo(() => [
    { path: '/consulta-placa', label: 'Consulta por Placa MTC' },
    { path: '/consulta-revision', label: 'Consulta de Revisión' },
    { path: '/consulta-gas', label: 'Inspección GLP / GNV' },
    { path: '/requisitos', label: 'Inspección Periódica Ordinaria' },
    { path: '/contacto', label: 'Servicio para Flotas y Empresas' },
  ], []);

  const socialIcons: Record<string, React.ReactNode> = {
    Facebook: <Facebook size={18} />,
    Instagram: <Instagram size={18} />,
    TikTok: <Music2 size={18} />,
  };

  return (
    <footer className="bg-[#0a0a0c] text-white pt-14 pb-8 font-sans border-t border-white/10 relative overflow-hidden">
      {/* Fondo con brillo sutil naranja */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-40 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner Superior de Acción Rápida */}
        <RevealOnScroll>
          <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-transparent border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-500 shrink-0">
                <ShieldCheck size={26} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  ¿Tu vehículo necesita revisión técnica hoy?
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
                  Centro de Inspección Técnica Vehicular (CITV) autorizado oficialmente por el MTC.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <Link
                to="/sedes"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-all border border-white/10"
              >
                <MapPin size={16} className="text-orange-500" />
                <span>Ver Sedes</span>
              </Link>
              <Link
                to="/cupon"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-orange-500/20"
              >
                <Ticket size={16} />
                <span>Obtener Cupón -S/10</span>
              </Link>
            </div>
          </div>
        </RevealOnScroll>

        {/* Contenido Principal en 4 Columnas */}
        <RevealOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/10">

            {/* Columna 1: Logo, Descripción y Redes (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              <Link to="/" className="inline-block group">
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl inline-block transition-transform duration-300 group-hover:scale-[1.02]">
                  <img
                    src="/LogoRTPSanCristobal_horizontal.png"
                    alt="Grupo San Cristóbal Logo"
                    className="h-10 w-auto object-contain"
                  />
                </div>
              </Link>

              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                Líderes en revisiones técnicas vehiculares en el Perú. Garantizamos inspecciones transparentes, rápidas y con equipos de última generación autorizados por el MTC.
              </p>

              {/* Redes Sociales */}
              <div className="pt-2">
                <p className="text-[11px] font-black tracking-widest text-gray-400 uppercase mb-3">
                  Síguenos en redes
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {socialLinks.map((s, i) => (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.name}
                      title={s.name}
                      className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all duration-200"
                    >
                      {socialIcons[s.name]}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna 2: Explorar / Navegación (3 cols) */}
            <div className="lg:col-span-3">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span>Explorar</span>
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {quickLinks.map((link, i) => (
                  <li key={i}>
                    <Link 
                      to={link.path} 
                      className="text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-2 group py-0.5"
                    >
                      <ChevronRight size={13} className="text-orange-500/60 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna 3: Consultas y Servicios (2 cols) */}
            <div className="lg:col-span-2">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span>Servicios</span>
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {serviceLinks.map((link, i) => (
                  <li key={i}>
                    <Link 
                      to={link.path} 
                      className="text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-2 group py-0.5"
                    >
                      <ChevronRight size={13} className="text-orange-500/60 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna 4: Contáctanos & Horarios (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span>Atención al Cliente</span>
              </h4>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <a 
                  href="tel:+51987654321" 
                  className="flex items-start gap-3 text-gray-300 hover:text-white group transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0 mt-0.5">
                    <Phone size={14} />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-bold">Teléfono / Celular</span>
                    <span className="font-medium text-gray-300 group-hover:text-orange-400">+51 987 654 321</span>
                  </div>
                </a>

                <a 
                  href="mailto:contacto@gruposancristobal.com" 
                  className="flex items-start gap-3 text-gray-300 hover:text-white group transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0 mt-0.5">
                    <Mail size={14} />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-bold">Correo Oficial</span>
                    <span className="font-medium text-gray-300 group-hover:text-orange-400 break-all">contacto@gruposancristobal.com</span>
                  </div>
                </a>

                <div className="flex items-start gap-3 text-gray-300">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-orange-500 shrink-0 mt-0.5">
                    <Clock size={14} />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-bold">Horario de Atención</span>
                    <span className="font-medium text-gray-300">Lun – Sáb: 7:00 AM a 6:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/contacto"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-orange-500 text-gray-300 hover:text-white border border-white/10 hover:border-orange-500 text-xs font-semibold transition-all duration-200"
                >
                  <span>Formulario de Contacto</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </RevealOnScroll>

        {/* Footer Bottom Bar */}
        <RevealOnScroll>
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Centro de Inspección Autorizado MTC</span>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <span className="hidden sm:inline">Perú</span>
            </div>

            <p className="text-[11px] text-gray-500">
              © {new Date().getFullYear()} <span className="text-gray-400 font-semibold">Grupo San Cristóbal</span>. Todos los derechos reservados.
            </p>
          </div>
        </RevealOnScroll>

      </div>
    </footer>
  );
}

