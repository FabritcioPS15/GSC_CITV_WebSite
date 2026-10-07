import { Link } from 'react-router-dom';
import { Home, AlertCircle, ChevronLeft } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import Seo from '../components/Seo';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-white relative overflow-hidden">
            {/* Una 404 no debe indexarse: si se indexa, compite con páginas reales. */}
            <Seo
                path="/404"
                title="Página no encontrada | RTP San Cristóbal"
                description="La página que buscas no existe o cambió de dirección."
                noindex
            />
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

            <RevealOnScroll>
                <div className="max-w-2xl w-full text-center relative z-10">
                    <div className="relative inline-block mb-8">
                        <h1 className="text-[150px] md:text-[200px] font-black leading-none text-black/5 select-none">
                            404
                        </h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="p-6 bg-orange-100 rounded-3xl rotate-12 shadow-xl border border-orange-200">
                                <AlertCircle className="w-16 h-16 text-orange-600" />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                        Oops! Página <span className="text-orange-500 text-6xl block md:inline">no encontrada</span>
                    </h2>

                    <p className="text-gray-500 text-lg mb-12 max-w-md mx-auto leading-relaxed">
                        Parece que la ruta que intentas seguir no existe o ha sido movida. ¡No te preocupes! Regresemos a la ruta principal.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/"
                            className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-orange-500 transition-all duration-300 shadow-xl shadow-black/10 active:scale-95 w-full sm:w-auto text-center justify-center"
                        >
                            <Home size={20} />
                            Volver al Inicio
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-2 px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-2xl font-bold hover:bg-gray-50 transition-all duration-300 w-full sm:w-auto text-center justify-center active:scale-95"
                        >
                            <ChevronLeft size={20} />
                            Regresar Atrás
                        </button>
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Nosotros", path: "/nosotros" },
                            { label: "Sedes", path: "/sedes" },
                            { label: "Requisitos", path: "/requisitos" },
                            { label: "Contacto", path: "/contacto" }
                        ].map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-sm font-medium text-gray-400 hover:text-orange-500 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </RevealOnScroll>
        </div>
    );
}
