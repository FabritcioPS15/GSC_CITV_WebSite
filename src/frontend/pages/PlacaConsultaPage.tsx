import { useState } from 'react';
import { Search, Car, AlertCircle, CheckCircle2, ExternalLink, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const helmetContent = (
  <Helmet>
    <title>Consulta de Placa | Grupo San Cristóbal</title>
    <meta name="description" content="Consulta la información de tu vehículo verificando su estado, última revisión técnica y fecha próxima de renovación." />
    <meta name="keywords" content="consulta placa, vehiculo, revision tecnica, MTC" />
    <link rel="canonical" href="https://tu-dominio.com/consulta-placa" />
  </Helmet>
);

export default function PlacaConsultaPage() {
    const [placa, setPlaca] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleConsulta = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!placa || placa.length < 6) {
            setError('Ingresa una placa válida (mínimo 6 caracteres)');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        // Simulación de consulta
        setTimeout(() => {
            setLoading(false);
            // Datos de ejemplo
            setResult({
                placa: placa.toUpperCase(),
                marca: 'Toyota',
                modelo: 'Yaris',
                anio: '2020',
                color: 'Blanco',
                estado: 'ACTIVO',
                ultimaRevision: '15/03/2025',
                proximaRevision: '15/03/2026',
                infracciones: 0
            });
        }, 1500);
    };

    return (
        <>
            {helmetContent}
            <div className="min-h-screen bg-[#f8fafc]">
                <Header />
                
                <main className="pt-[90px]">
                    {/* HERO SECTION */}
                    <section className="page-banner">
                        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
                            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

                        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
                            <div className="max-w-3xl">
                                <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                                    <ArrowLeft size={18} />
                                    <span className="text-sm">Volver al inicio</span>
                                </Link>
                                <p className="text-orange-500 font-bold tracking-[0.2em] uppercase text-sm mb-4">SERVICIOS DIGITALES</p>
                                <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6">
                                    Consulta de <span className="text-orange-500">Placa</span>
                                </h1>
                                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                                    Consulta la información de tu vehículo verificando su estado, última revisión técnica y fecha próxima de renovación.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="max-w-4xl mx-auto px-4 py-12">
                        {/* Formulario de consulta */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900">Ingresa tu Placa</h3>
                            </div>
                            <form onSubmit={handleConsulta} className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Número de Placa
                                        </label>
                                        <input
                                            type="text"
                                            value={placa}
                                            onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                                            placeholder="Ej: ABC-1234"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-lg font-mono uppercase"
                                            maxLength={8}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Formato: Letras y números (ej: ABC-1234)
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                                            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                                            <p className="text-red-700 text-sm">{error}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Consultando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Search size={20} />
                                                <span>Consultar Placa</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Resultado de la consulta */}
                        {result && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 mb-8">
                                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="text-green-600" size={24} />
                                        <h3 className="text-xl font-bold text-gray-900">Resultado de Consulta</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Placa</p>
                                                <p className="text-2xl font-bold text-gray-900 font-mono">{result.placa}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Marca</p>
                                                <p className="text-lg font-semibold text-gray-900">{result.marca}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Modelo</p>
                                                <p className="text-lg font-semibold text-gray-900">{result.modelo}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Año</p>
                                                <p className="text-lg font-semibold text-gray-900">{result.anio}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Color</p>
                                                <p className="text-lg font-semibold text-gray-900">{result.color}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Estado</p>
                                                <p className="text-lg font-semibold text-orange-600">{result.estado}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                                            <p className="text-xs text-orange-600 uppercase tracking-wider mb-1">Última Revisión</p>
                                            <p className="text-lg font-bold text-gray-900">{result.ultimaRevision}</p>
                                        </div>
                                        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                                            <p className="text-xs text-orange-600 uppercase tracking-wider mb-1">Próxima Revisión</p>
                                            <p className="text-lg font-bold text-gray-900">{result.proximaRevision}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-yellow-600 uppercase tracking-wider mb-1">Infracciones</p>
                                                <p className="text-2xl font-bold text-gray-900">{result.infracciones}</p>
                                            </div>
                                            <Car className="text-yellow-600" size={32} />
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <a
                                            href="https://www.gob.pe/mtc"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
                                        >
                                            Ver más detalles en el portal del MTC
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Nota */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                            <div className="flex items-start gap-4">
                                <AlertCircle className="text-gray-400 flex-shrink-0 mt-1" size={20} />
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2 text-sm">Nota Importante</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Esta es una consulta de demostración. Para obtener información oficial y actualizada, 
                                        utiliza el portal del MTC o acércate a nuestras sedes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                
                <Footer />
            </div>
        </>
    );
}
