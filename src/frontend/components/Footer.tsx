import React, { useMemo } from 'react';
import {
  Phone,
  Mail,
  Clock,
  ChevronRight,
  MapPin,
  FileText,
  Calendar,
  Search
} from 'lucide-react';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import RevealOnScroll from './RevealOnScroll';
import { socialLinks } from '../../backend/data/social';
import { EMAIL_CONTACTO, MAILTO_CONTACTO, TELEFONO_CONTACTO } from '../../backend/data/contacto';

export default function Footer() {
  const quickLinks = useMemo(() => [
    { path: '/', label: 'Inicio' },
    { path: '/nosotros', label: 'Nosotros' },
    { path: '/sedes', label: 'Nuestras Sedes' },
    { path: '/cronograma', label: 'Cronograma MTC' },
    { path: '/requisitos', label: 'Requisitos de Inspección' },
  ], []);

  const serviceLinks = useMemo(() => [
    { path: '/consulta-placa', label: 'Consulta por Placa MTC' },
    { path: '/consulta-revision', label: 'Consulta de Revisión' },
    { path: '/consulta-gas', label: 'Inspección GLP / GNV' },
    { path: '/requisitos', label: 'Inspección Periódica Ordinaria' },
    { path: '/contacto', label: 'Servicio para Flotas y Empresas' },
  ], []);

  const mobileLinks = useMemo(() => [
    { path: '/sedes', label: 'Sedes', icon: <MapPin size={13} /> },
    { path: '/cronograma', label: 'Cronograma MTC', icon: <Calendar size={13} /> },
    { path: '/requisitos', label: 'Requisitos', icon: <FileText size={13} /> },
    { path: '/consulta-placa', label: 'Consulta Placa', icon: <Search size={13} /> },
  ], []);

  const socialIcons: Record<string, React.ReactNode> = {
    Facebook: <FaFacebook size={16} />,
    Instagram: <FaInstagram size={16} />,
    TikTok: <FaTiktok size={16} />,
  };

  return (
    <footer className="bg-[#0a0a0c] text-white pt-6 pb-6 lg:pt-14 lg:pb-8 font-sans border-t border-white/10 relative overflow-hidden">
      {/* Fondo con brillo sutil naranja */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-40 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ========================================================= */}
        {/* VISTA MÓVIL COMPACTA Y RESUMIDA (< lg)                    */}
        {/* ========================================================= */}
        <div className="block lg:hidden space-y-4">
          {/* Fila 1: Logo + Redes Sociales en una sola línea compacta */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
            <Link to="/" className="inline-block">
              <img
                src="/LogoRTPSanCristobal_horizontal.png"
                alt="Grupo San Cristóbal Logo"
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <div className="flex items-center gap-1.5">
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-orange-500 hover:text-white transition-all"
                >
                  {socialIcons[s.name]}
                </a>
              ))}
            </div>
          </div>

          {/* Fila 2: Enlaces Rápidos en Cuadrícula 2x2 */}
          <div className="grid grid-cols-2 gap-2">
            {mobileLinks.map((link, i) => (
              <Link
                key={i}
                to={link.path}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white/5 border border-white/5 text-gray-300 hover:text-white hover:bg-white/10 text-xs font-medium transition-all"
              >
                <span className="text-orange-500">{link.icon}</span>
                <span className="truncate">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Fila 3: Horario simple sin cuadro */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
            <Clock size={12} className="text-orange-500 shrink-0" />
            <span>Lun - Sáb: 7:00 am - 6:00 pm</span>
          </div>

          {/* Fila 4: Enlaces Legales compactos */}
          <div className="pt-2 border-t border-white/10">
            <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[10px] text-gray-400">
              <Link to="/privacidad" className="hover:text-orange-400">Privacidad</Link>
              <span>•</span>
              <Link to="/terminos" className="hover:text-orange-400">Términos</Link>
              <span>•</span>
              <Link to="/cookies" className="hover:text-orange-400">Cookies</Link>
              <span>•</span>
              <Link to="/libro-de-reclamaciones" className="hover:text-orange-400">Libro Reclamaciones</Link>
            </div>
          </div>

          {/* Fila 5: Badge MTC y Copyright Ultra Reducido */}
          <div className="text-center space-y-0.5 pt-1 text-[9px] text-gray-500">
            <div className="flex items-center justify-center gap-1.5 text-gray-400 font-medium text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Centro Autorizado MTC</span>
            </div>
            <p className="text-[9px] text-gray-500/80">© {new Date().getFullYear()} Grupo San Cristóbal. Todos los derechos reservados.</p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* VISTA ESCRITORIO COMPLETA (>= lg)                         */}
        {/* ========================================================= */}
        <div className="hidden lg:block">
          <RevealOnScroll>
            <div className="grid grid-cols-12 gap-8 pb-14 border-b border-white/10">

              {/* Columna 1: Logo, Descripción y Redes (4 cols) */}
              <div className="col-span-4 space-y-5">
                <Link to="/" className="inline-block group">
                  <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl inline-block transition-transform duration-300 group-hover:scale-[1.02]">
                    <img
                      src="/LogoRTPSanCristobal_horizontal.png"
                      alt="Grupo San Cristóbal Logo"
                      className="h-12 w-auto object-contain brightness-0 invert"
                    />
                  </div>
                </Link>

                <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                  Líderes en revisiones técnicas vehiculares en el Perú.
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
              <div className="col-span-3">
                <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Explorar</span>
                </h4>
                <ul className="space-y-2.5 text-sm">
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
              <div className="col-span-2">
                <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Servicios</span>
                </h4>
                <ul className="space-y-2.5 text-sm">
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
              <div className="col-span-3 space-y-4">
                <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Atención al Cliente</span>
                </h4>

                <div className="space-y-3.5 text-sm">
                  <a
                    href={`tel:${TELEFONO_CONTACTO.replace(/\s/g, '')}`}
                    className="flex items-start gap-3 text-gray-300 hover:text-white group transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0 mt-0.5">
                      <Phone size={14} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-bold">Teléfono / Celular</span>
                      <span className="font-medium text-gray-300 group-hover:text-orange-400">{TELEFONO_CONTACTO}</span>
                    </div>
                  </a>

                  <a
                    href={MAILTO_CONTACTO}
                    className="flex items-start gap-3 text-gray-300 hover:text-white group transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors shrink-0 mt-0.5">
                      <Mail size={14} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest block font-bold">Correo Oficial</span>
                      <span className="font-medium text-gray-300 group-hover:text-orange-400 break-words">{EMAIL_CONTACTO}</span>
                    </div>
                  </a>

                  <div className="flex items-start gap-3 text-gray-300">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-orange-500 shrink-0 mt-0.5">
                      <Clock size={14} />
                    </div>
                    <div className="min-w-0">
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

          {/* Aviso de protección de datos y enlaces legales en Desktop */}
          <RevealOnScroll>
            <div className="mt-10 border-t border-white/10 pt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <p className="text-[11px] text-gray-500 leading-relaxed max-w-xl">
                Al navegar este sitio acepta el tratamiento de sus datos personales conforme a la Ley N.° 29733.
                Puede ejercer sus derechos de acceso, rectificación, cancelación y oposición.
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold text-gray-400">
                <Link to="/privacidad" className="hover:text-orange-400 transition-colors">Política de Privacidad</Link>
                <Link to="/cookies" className="hover:text-orange-400 transition-colors">Política de Cookies</Link>
                <Link to="/terminos" className="hover:text-orange-400 transition-colors">Términos y Condiciones</Link>
                <Link to="/libro-de-reclamaciones" className="hover:text-orange-400 transition-colors">Libro de Reclamaciones</Link>
                <button
                  onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
                  className="hover:text-orange-400 transition-colors"
                >
                  Configurar cookies
                </button>
              </div>
            </div>
          </RevealOnScroll>

          {/* Footer Bottom Bar Desktop */}
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

      </div>
    </footer>
  );
}


