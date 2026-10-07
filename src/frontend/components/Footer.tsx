import React, { useMemo } from 'react';
import {
  Phone,
  Mail,
  Clock,
  ChevronRight,
  MapPin,
  FileText,
  Calendar,
  Search,
  Heart
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
            <Link to="/" className="inline-block" aria-label="RTP San Cristóbal - Inicio">
              <img
                src="/LogoRTPSanCristobal_horizontal.png"
                alt="RTP San Cristóbal Logo"
                className="h-9 w-auto object-contain brightness-0 invert"
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
            <p className="text-[9px] text-gray-500/80">© {new Date().getFullYear()} RTP San Cristóbal. Todos los derechos reservados.</p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* VISTA ESCRITORIO COMPLETA (>= lg)                         */}
        {/* ========================================================= */}
        <div className="hidden lg:block">
          <RevealOnScroll>
            <div className="grid grid-cols-12 gap-8 pb-14 border-b border-white/10">

              {/* Columna 1: Logo, Descripción y Redes (4 cols) */}
              <div className="col-span-4">
                <Link to="/" className="inline-block group" aria-label="RTP San Cristóbal - Inicio">
                  <img
                    src="/LogoRTPSanCristobal_horizontal.png"
                    alt="RTP San Cristóbal Logo"
                    className="h-16 w-auto object-contain brightness-0 invert transition-opacity duration-300 group-hover:opacity-80"
                  />
                </Link>

                <p className="mt-5 max-w-sm text-sm leading-relaxed text-gray-400">
                  Centro de inspección técnica vehicular autorizado por el MTC. Verificamos el estado de tu
                  vehículo con equipos calibrados y personal técnico certificado.
                </p>

                {/* Redes Sociales */}
                <div className="mt-5">
                  <p className="mb-4 text-[11px] font-black uppercase tracking-widest text-gray-400">
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

              {/* Columna 2: Explorar / Navegación (4 cols) */}
              <div className="col-span-4">
                <h4 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Explorar</span>
                </h4>
                <ul className="grid grid-cols-1 gap-2.5 text-sm">
                  {quickLinks.map((link, i) => (
                    <li key={i}>
                      <Link
                        to={link.path}
                        className="group flex items-center gap-2 py-0.5 text-gray-400 transition-colors hover:text-orange-400"
                      >
                        <ChevronRight size={13} className="text-orange-500/60 transition-all group-hover:translate-x-0.5 group-hover:text-orange-500" />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Columna 3: Contáctanos & Horarios (4 cols) */}
              <div className="col-span-4">
                <h4 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Atención al Cliente</span>
                </h4>

                <div className="space-y-3.5 text-sm">
                  <a
                    href={`tel:${TELEFONO_CONTACTO.replace(/\s/g, '')}`}
                    className="group flex items-start gap-3 text-gray-300 transition-colors hover:text-white"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-orange-500 transition-colors group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white">
                      <Phone size={14} />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">Teléfono / Celular</span>
                      <span className="font-medium text-gray-300 group-hover:text-orange-400">{TELEFONO_CONTACTO}</span>
                    </div>
                  </a>

                  <a
                    href={MAILTO_CONTACTO}
                    className="group flex items-start gap-3 text-gray-300 transition-colors hover:text-white"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-orange-500 transition-colors group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white">
                      <Mail size={14} />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">Correo Oficial</span>
                      <span className="break-words font-medium text-gray-300 group-hover:text-orange-400">{EMAIL_CONTACTO}</span>
                    </div>
                  </a>

                  <div className="flex items-start gap-3 text-gray-300">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-orange-500">
                      <Clock size={14} />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-500">Horario de Atención</span>
                      <span className="font-medium text-gray-300">Lun – Sáb: 7:00 AM a 6:00 PM</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/contacto"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-gray-300 transition-all duration-200 hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  <span>Formulario de Contacto</span>
                  <ChevronRight size={14} />
                </Link>
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
              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Centro de Inspección Autorizado MTC</span>
                <span className="text-gray-600 hidden sm:inline">•</span>
                <span className="hidden sm:inline">Perú</span>
                {/* Easter eggs: mismo color que el fondo del footer (#0a0a0c),
                    separadores incluidos, para que el bloque no se vea hasta
                    que alguien lo seleccione o inspeccione. */}
                <span className="hidden sm:inline text-[#0a0a0c]">•</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[#0a0a0c]">
                  En Honor a Balto
                  <Heart size={12} className="fill-current" aria-hidden="true" />
                </span>
                <span className="hidden sm:inline text-[#0a0a0c]">•</span>
                <span className="hidden sm:inline text-[#0a0a0c]">
                  Realizado por: <span className="font-semibold">Sparktree Studio</span>
                </span>
              </div>

              <p className="text-[11px] text-gray-500">
                © {new Date().getFullYear()} <span className="text-gray-400 font-semibold">RTP San Cristóbal</span>. Todos los derechos reservados.
              </p>
            </div>
          </RevealOnScroll>
        </div>

      </div>
    </footer>
  );
}


