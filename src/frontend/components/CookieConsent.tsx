import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X, SlidersHorizontal, Check, Cookie } from 'lucide-react';

export interface CookiePrefs {
  necessary: true;
  location: boolean;
  routes: boolean;
  analytics: boolean;
}

const STORAGE_KEY = 'cookieConsent';
const VERSION = '1.0';
const SAVED_KEY = `${STORAGE_KEY}_saved`;

const DEFAULTS: CookiePrefs = { necessary: true, location: false, routes: false, analytics: false };

const readSavedPrefs = (): CookiePrefs | null => {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookiePrefs>;
    return {
      necessary: true,
      location: !!parsed.location,
      routes: !!parsed.routes,
      analytics: !!parsed.analytics,
    };
  } catch {
    return null;
  }
};

const persist = (prefs: CookiePrefs) => {
  localStorage.setItem(SAVED_KEY, JSON.stringify(prefs));
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ acceptedAt: new Date().toISOString(), version: VERSION, prefs })
  );
  window.dispatchEvent(new CustomEvent('cookie-consent-change', { detail: prefs }));
};

const CATEGORIES: { key: keyof CookiePrefs; label: string; desc: string; locked?: boolean }[] = [
  {
    key: 'necessary',
    label: 'Estrictamente necesarias',
    desc: 'Imprescindibles para el funcionamiento del sitio y para registrar su decision. No requieren consentimiento.',
    locked: true,
  },
  {
    key: 'location',
    label: 'Geolocalizacion',
    desc: 'Permite detectar la sede mas cercana. Sus coordenadas se guardan solo en este navegador.',
  },
  {
    key: 'routes',
    label: 'Calculo de rutas con terceros',
    desc: 'Envia sus coordenadas a OpenStreetMap (OSRM) para estimar distancia y tiempo hasta la sede.',
  },
  {
    key: 'analytics',
    label: 'Analitica',
    desc: 'Medir el uso del sitio de forma agregada. Actualmente no se usa, se mantiene para su control.',
  },
];

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>(readSavedPrefs() ?? DEFAULTS);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const open = () => {
      setPrefs(readSavedPrefs() ?? DEFAULTS);
      setShowSettings(true);
      setVisible(true);
    };
    window.addEventListener('open-cookie-settings', open);
    return () => window.removeEventListener('open-cookie-settings', open);
  }, []);

  const toggle = (key: keyof CookiePrefs) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  const handleSave = (next: CookiePrefs) => {
    persist(next);
    setPrefs(next);
    setVisible(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    handleSave({ necessary: true, location: true, routes: true, analytics: true });
  };

  const handleReject = () => {
    handleSave(DEFAULTS);
  };

  const activeCount = CATEGORIES.filter((c) => !c.locked && prefs[c.key]).length;

  return (
    <>
      {visible && !showSettings && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-title"
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-[110] animate-in fade-in slide-in-from-bottom-10 duration-500"
        >
          <div className="bg-white border-2 border-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-orange-500/10 rounded-2xl shrink-0">
                    <ShieldCheck className="text-orange-600 w-6 h-6" />
                  </div>
                  <h3 id="cookie-title" className="text-lg font-bold text-gray-900 tracking-tight leading-tight">
                    Privacidad y cookies
                  </h3>
                </div>
                <button
                  onClick={handleReject}
                  aria-label="Rechazar y cerrar"
                  className="text-gray-400 hover:text-gray-700 transition-colors p-1 shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-[13px] text-gray-600 leading-relaxed mb-4">
                Usamos cookies propias y de terceros para su navegacion y para mostrarle la sede mas cercana.
                Puede aceptar todas, rechazar todas o elegir categoria por categoria. Los datos que envia por
                formularios se tratan conforme a la{' '}
                <Link to="/privacidad" className="text-orange-600 font-semibold underline hover:text-orange-700">
                  Politica de Privacidad
                </Link>
                .
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleAcceptAll}
                  className="w-full bg-gray-900 text-white px-5 py-3 font-bold text-sm hover:bg-black active:scale-[0.98] transition-all"
                >
                  Aceptar todas
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleReject}
                    className="px-4 py-2.5 border-2 border-gray-200 text-gray-700 font-bold text-xs hover:border-gray-900 hover:bg-gray-50 active:scale-[0.98] transition-all"
                  >
                    Rechazar todas
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 border-2 border-gray-200 text-gray-700 font-bold text-xs hover:border-orange-500 hover:text-orange-600 active:scale-[0.98] transition-all"
                  >
                    <SlidersHorizontal size={13} />
                    Configurar
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 text-center mt-4 leading-relaxed">
                Ley N. 29733 de Proteccion de Datos Personales &middot;{' '}
                <Link to="/cookies" className="underline hover:text-orange-600">
                  Ver politica de cookies
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {visible && showSettings && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-settings-title"
          className="fixed inset-0 z-[120] flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm p-0 md:p-6 animate-in fade-in duration-300"
        >
          <div className="bg-white w-full md:max-w-2xl max-h-[92dvh] flex flex-col animate-in slide-in-from-bottom-10 duration-400">
            <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-xl shrink-0">
                  <Cookie className="text-orange-600 w-5 h-5" />
                </div>
                <div>
                  <h3 id="cookie-settings-title" className="font-bold text-gray-900 leading-tight">
                    Configurar cookies
                  </h3>
                  <p className="text-xs text-gray-500">
                    {activeCount} de {CATEGORIES.length - 1} categorias opcionales activas
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowSettings(false);
                  setVisible(false);
                }}
                aria-label="Cerrar configuracion"
                className="text-gray-400 hover:text-gray-700 p-1 shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-4 flex-1 min-h-0 divide-y divide-gray-100">
              {CATEGORIES.map((cat) => (
                <div key={cat.key} className="py-4 flex items-start gap-4">
                  <button
                    role="switch"
                    aria-checked={prefs[cat.key]}
                    aria-label={cat.label}
                    disabled={cat.locked}
                    onClick={() => !cat.locked && toggle(cat.key)}
                    className={`relative w-12 h-6 shrink-0 mt-0.5 rounded-full transition-colors ${
                      prefs[cat.key] ? 'bg-orange-500' : 'bg-gray-300'
                    } ${cat.locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        prefs[cat.key] ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      {cat.label}
                      {cat.locked && (
                        <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5">
                          Siempre activa
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed mt-1">{cat.desc}</p>
                  </div>
                </div>
              ))}

              <p className="text-xs text-gray-500 leading-relaxed pt-4">
                Detalle completo en la{' '}
                <Link to="/cookies" className="text-orange-600 font-semibold underline">
                  Politica de Cookies
                </Link>{' '}
                y la{' '}
                <Link to="/privacidad" className="text-orange-600 font-semibold underline">
                  Politica de Privacidad
                </Link>
                .
              </p>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleAcceptAll}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-3 font-bold text-sm hover:bg-black active:scale-[0.98] transition-all"
              >
                <Check size={15} />
                Aceptar todas
              </button>
              <button
                onClick={() => handleSave(prefs)}
                className="flex-1 px-5 py-3 border-2 border-gray-200 text-gray-700 font-bold text-sm hover:border-gray-900 hover:bg-gray-50 active:scale-[0.98] transition-all"
              >
                Guardar mis preferencias
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const openCookieSettings = () => window.dispatchEvent(new Event('open-cookie-settings'));

export default CookieConsent;
