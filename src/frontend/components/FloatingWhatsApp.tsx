import { useState, useRef, useEffect, useMemo, FC } from 'react';
import { Link } from 'react-router-dom';
import { X, MapPin, Phone, ArrowRight } from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";
import { branches, whatsappUrl, WHATSAPP_INSPECCION } from '../../backend/data/branches';
import { useMobileMenu } from '../context/MobileMenuContext';

interface Sede {
  id: string;
  name: string;
  phone: string;
  address: string;
  region: 'lima' | 'provincia';
  url: string;
}

const REGIONES: { key: 'lima' | 'provincia'; label: string }[] = [
  { key: 'lima', label: 'Lima' },
  { key: 'provincia', label: 'Provincias' }
];

const FloatingWhatsApp: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // El drawer móvil ya tiene su propio acceso a WhatsApp, así que el flotante
  // se aparta mientras esté abierto para no quedar debajo ni tapar el menú.
  const { isOpen: mobileMenuOpen } = useMobileMenu();

  useEffect(() => {
    if (mobileMenuOpen) setIsOpen(false);
  }, [mobileMenuOpen]);

  // Vuelve a desktop por resize sin dejar el botón pegado en un breakpoint.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const sedes: Sede[] = useMemo(() => {
    return branches
      .filter(branch => !!branch.phone)
      .map(branch => ({
        id: branch.id.toString(),
        name: branch.name,
        phone: branch.phone || '',
        address: branch.address,
        region: branch.region,
        // El teléfono local no trae código de país: whatsappUrl() normaliza a 51XXXXXXXXX.
        url: whatsappUrl(
          branch.whatsapp ?? branch.phone,
          `Hola, quisiera información sobre la sede de ${branch.name}.`
        )
      }));
  }, []);

  // Agrupadas por región para que con 7 sedes no haya que leer toda la lista.
  const grupos = useMemo(() => {
    return REGIONES
      .map(({ key, label }) => ({
        label,
        sedes: sedes.filter(s => s.region === key)
      }))
      .filter(g => g.sedes.length > 0);
  }, [sedes]);

  const centralUrl = whatsappUrl(
    WHATSAPP_INSPECCION,
    'Hola, quisiera información sobre las inspecciones vehiculares.'
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const cerrar = (): void => setIsOpen(false);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        mobileMenuOpen
          ? 'opacity-0 scale-90 pointer-events-none translate-y-2'
          : 'opacity-100 scale-100'
      }`}
      ref={dropdownRef}
      aria-hidden={mobileMenuOpen}
    >
      {isOpen && sedes.length > 0 && (
        <div
          role="dialog"
          aria-label="Elegir sede para escribir por WhatsApp"
          className="absolute bottom-16 right-0 w-[calc(100vw_-_3rem)] sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 border border-gray-200"
        >
          <div className="bg-green-600 px-4 py-3 text-white flex justify-between items-center gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <FaWhatsapp className="shrink-0" size={22} />
              <div className="min-w-0">
                <p className="font-bold text-sm leading-tight">Elige una sede</p>
                <p className="text-[11px] text-green-100 leading-tight">
                  {sedes.length} sede{sedes.length === 1 ? '' : 's'} con WhatsApp
                </p>
              </div>
            </div>
            <button
              onClick={cerrar}
              className="shrink-0 text-white hover:text-green-100 transition-colors"
              aria-label="Cerrar menú"
            >
              <X size={18} />
            </button>
          </div>

          <a
            href={centralUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={cerrar}
            className="flex items-center gap-3 px-4 py-3 bg-orange-50 hover:bg-orange-100 transition-colors border-b border-orange-100"
          >
            <div className="bg-white p-2 rounded-full shrink-0 shadow-sm">
              <Phone className="text-orange-600" size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 leading-tight">Atención central</p>
              <p className="text-xs text-gray-600 leading-tight">¿No sabes qué sede elegir? Escríbenos</p>
            </div>
            <FaWhatsapp className="text-green-500 shrink-0" size={18} />
          </a>

          <div className="max-h-[min(24rem,60vh)] overflow-y-auto overscroll-contain">
            {grupos.map((grupo) => (
              <div key={grupo.label}>
                <p className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 border-y border-gray-100">
                  {grupo.label}
                </p>
                {grupo.sedes.map((sede: Sede) => (
                  <a
                    key={sede.id}
                    href={sede.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={cerrar}
                    className="group flex items-start gap-3 px-4 py-3 hover:bg-green-50 transition-colors border-b border-gray-100"
                  >
                    <div className="bg-green-100 p-2 rounded-full shrink-0 group-hover:bg-green-200 transition-colors">
                      <MapPin className="text-green-600" size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 leading-tight">{sede.name}</p>
                      <p className="flex items-center mt-1 text-xs text-gray-600">
                        <Phone className="text-gray-400 mr-1 shrink-0" size={12} />
                        {sede.phone}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 leading-snug">{sede.address}</p>
                    </div>
                    <FaWhatsapp className="text-green-500 mt-1 shrink-0 group-hover:text-green-600 transition-colors" size={18} />
                  </a>
                ))}
              </div>
            ))}
          </div>

          <Link
            to="/sedes"
            onClick={cerrar}
            className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-green-50 px-4 py-3 text-xs font-black uppercase tracking-widest text-gray-700 hover:text-green-700 transition-colors"
          >
            Ver todas las sedes
            <ArrowRight size={14} className="shrink-0" />
          </Link>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-105 ${isOpen ? 'rotate-180' : ''
          }`}
        aria-label={isOpen ? 'Cerrar lista de sedes' : 'Abrir chat de WhatsApp'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <FaWhatsapp size={24} />}
      </button>
    </div>
  );
};

export default FloatingWhatsApp;
