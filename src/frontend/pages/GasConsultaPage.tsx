import { useState } from 'react';
import { Fuel, AlertCircle, CheckCircle2, ExternalLink, ArrowLeft, Shield } from 'lucide-react';
import Seo from '../components/Seo';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const helmetContent = (
    <Seo
        path="/consulta-gas"
        title="Consulta de Certificación de Gas GNV y GLP | Grupo San Cristóbal"
        description="Consulta la certificación de gas de tu vehículo (GNV o GLP) verificando el estado del cilindro y los componentes del sistema. Revisión vehicular autorizada por el MTC."
        keywords={['consulta gas vehicular', 'certificación GNV', 'certificación GLP', 'inspección de gas vehicular', 'cilindro GNV MTC']}
    />
);

export default function GasConsultaPage() {
    const [codigo, setCodigo] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleConsulta = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!codigo || codigo.length < 8) {
            setError('Ingresa un cÃ³digo de certificaciÃ³n vÃ¡lido (mÃ­nimo 8 caracteres)');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        // SimulaciÃ³n de consulta
        setTimeout(() => {
            setLoading(false);
            // Datos de ejemplo
            setResult({
                codigo: codigo.toUpperCase(),
                tipoGas: 'GNV',
                fechaEmision: '10/02/2025',
                fechaVencimiento: '10/02/2026',
                resultado: 'APROBADO',
                sede: 'Sede RTP Callao',
                tecnico: 'TEC. Carlos RodrÃ­guez',
                observaciones: 'Sistema de gas en Ã³ptimas condiciones. Sin fugas detectadas.',
                cilindro: {
                    marca: 'Tomasetto',
                    capacidad: '60L',
                    fechaFabricacion: '2020',
                    estado: 'APROBADO'
                },
                itemsVerificados: [
                    { item: 'Cilindro', estado: 'APROBADO' },
                    { item: 'VÃ¡lvula', estado: 'APROBADO' },
                    { item: 'Regulador', estado: 'APROBADO' },
                    { item: 'TuberÃ­a', estado: 'APROBADO' },
                    { item: 'Conexiones', estado: 'APROBADO' },
                    { item: 'Fugas', estado: 'APROBADO' }
                ]
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
                                    Consulta de <span className="text-orange-500">Gas (GNV/GLP)</span>
                                </h1>
                                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                                    Consulta la certificaciÃ³n de tu sistema de gas vehicular (GNV o GLP) verificando el estado del cilindro y componentes.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="max-w-4xl mx-auto px-4 py-12">
                        {/* Formulario de consulta */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900">Ingresa el CÃ³digo de CertificaciÃ³n</h3>
                            </div>
                            <form onSubmit={handleConsulta} className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            CÃ³digo de CertificaciÃ³n
                                        </label>
                                        <input
                                            type="text"
                                            value={codigo}
                                            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                                            placeholder="Ej: GAS-2025-12345"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-lg font-mono uppercase"
                                            maxLength={15}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            El cÃ³digo se encuentra en tu certificado de gas
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
                                                <Fuel size={20} />
                                                <span>Consultar Gas</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Resultado de la consulta */}
                        {result && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 mb-8">
                                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-cyan-100">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="text-cyan-600" size={24} />
                                        <h3 className="text-xl font-bold text-gray-900">Resultado de CertificaciÃ³n Gas</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-4">
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">CÃ³digo</p>
                                                <p className="text-lg font-bold text-gray-900 font-mono">{result.codigo}</p>
                                            </div>
                                            <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-200">
                                                <p className="text-xs text-cyan-600 uppercase tracking-wider mb-1">Tipo de Gas</p>
                                                <p className="text-2xl font-bold text-cyan-600">{result.tipoGas}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Fecha de EmisiÃ³n</p>
                                                <p className="text-lg font-semibold text-gray-900">{result.fechaEmision}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Vencimiento</p>
                                                <p className="text-lg font-semibold text-gray-900">{result.fechaVencimiento}</p>
                                            </div>
                                            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                                                <p className="text-xs text-orange-500 uppercase tracking-wider mb-1">Resultado</p>
                                                <p className="text-2xl font-bold text-white">{result.resultado}</p>
                                            </div>
                                            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                                                <p className="text-xs text-orange-500 uppercase tracking-wider mb-1">Sede</p>
                                                <p className="text-lg font-semibold text-white">{result.sede}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* InformaciÃ³n del cilindro */}
                                    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Shield className="text-orange-500" size={20} />
                                            <h4 className="text-sm font-bold text-white">InformaciÃ³n del Cilindro</h4>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div>
                                                <p className="text-xs text-orange-500 mb-1">Marca</p>
                                                <p className="text-sm font-semibold text-white">{result.cilindro.marca}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-orange-500 mb-1">Capacidad</p>
                                                <p className="text-sm font-semibold text-white">{result.cilindro.capacidad}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-orange-500 mb-1">FabricaciÃ³n</p>
                                                <p className="text-sm font-semibold text-white">{result.cilindro.fechaFabricacion}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-orange-500 mb-1">Estado</p>
                                                <p className="text-sm font-semibold text-orange-400">{result.cilindro.estado}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
                                        <p className="text-xs text-orange-500 uppercase tracking-wider mb-2">Observaciones</p>
                                        <p className="text-gray-300 text-sm leading-relaxed">{result.observaciones}</p>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="text-sm font-bold text-gray-900 mb-3">Ãtems Verificados</h4>
                                        <div className="space-y-2">
                                            {result.itemsVerificados.map((item: any, index: number) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-200"
                                                >
                                                    <span className="text-sm font-medium text-gray-700">{item.item}</span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        item.estado === 'APROBADO'
                                                            ? 'bg-green-100 text-green-700'
                                                            : item.estado === 'OBSERVADO'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {item.estado}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200">
                                        <a
                                            href="https://www.gob.pe/mtc"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors"
                                        >
                                            Ver mÃ¡s detalles en el portal del MTC
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
                                        Esta es una consulta de demostraciÃ³n. Para obtener informaciÃ³n oficial y actualizada, 
                                        utiliza el portal del MTC o acÃ©rcate a nuestras sedes.
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
