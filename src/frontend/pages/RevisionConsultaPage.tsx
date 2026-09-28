import { useState } from 'react';
import { FileText, AlertCircle, CheckCircle2, ExternalLink, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const helmetContent = (
  <Helmet>
    <title>Consulta de Revisión Técnica | Grupo San Cristóbal</title>
    <meta name="description" content="Consulta el resultado de tu revisión técnica ingresando el código que aparece en tu certificado o sticker." />
    <meta name="keywords" content="consulta revision tecnica, certificado, sticker, MTC" />
    <link rel="canonical" href="https://tu-dominio.com/consulta-revision" />
  </Helmet>
);

export default function RevisionConsultaPage() {
    const [codigo, setCodigo] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleConsulta = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!codigo || codigo.length < 8) {
            setError('Ingresa un código de revisión válido (mínimo 8 caracteres)');
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
                codigo: codigo.toUpperCase(),
                fechaEmision: '15/03/2025',
                fechaVencimiento: '15/03/2026',
                resultado: 'APROBADO',
                sede: 'Sede RTP Callao',
                inspector: 'ING. Juan Pérez',
                observaciones: 'Vehículo en buenas condiciones. Todos los sistemas operativos.',
                itemsVerificados: [
                    { item: 'Frenos', estado: 'APROBADO' },
                    { item: 'Luces', estado: 'APROBADO' },
                    { item: 'Suspensión', estado: 'APROBADO' },
                    { item: 'Neumáticos', estado: 'OBSERVADO' },
                    { item: 'Emisiones', estado: 'APROBADO' },
                    { item: 'Documentación', estado: 'APROBADO' }
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
                                    Consulta de <span className="text-orange-500">Revisión Técnica</span>
                                </h1>
                                <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                                    Consulta el resultado de tu revisión técnica ingresando el código que aparece en tu certificado o sticker.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="max-w-4xl mx-auto px-4 py-12">
                        {/* Formulario de consulta */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900">Ingresa el Código de Revisión</h3>
                            </div>
                            <form onSubmit={handleConsulta} className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Código de Revisión
                                        </label>
                                        <input
                                            type="text"
                                            value={codigo}
                                            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                                            placeholder="Ej: RTV-2025-12345"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-lg font-mono uppercase"
                                            maxLength={15}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            El código se encuentra en tu certificado o sticker de revisión
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
                                                <FileText size={20} />
                                                <span>Consultar Revisión</span>
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
                                        <h3 className="text-xl font-bold text-gray-900">Resultado de Revisión</h3>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-4">
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Código</p>
                                                <p className="text-lg font-bold text-gray-900 font-mono">{result.codigo}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Fecha de Emisión</p>
                                                <p className="text-lg font-semibold text-gray-900">{result.fechaEmision}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Vencimiento</p>
                                                <p className="text-lg font-semibold text-gray-900">{result.fechaVencimiento}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                                                <p className="text-xs text-green-600 uppercase tracking-wider mb-1">Resultado</p>
                                                <p className="text-2xl font-bold text-green-600">{result.resultado}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Sede</p>
                                                <p className="text-lg font-semibold text-gray-900">{result.sede}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Inspector</p>
                                                <p className="text-lg font-semibold text-gray-900">{result.inspector}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-200 mb-6">
                                        <p className="text-xs text-orange-600 uppercase tracking-wider mb-2">Observaciones</p>
                                        <p className="text-gray-700 text-sm leading-relaxed">{result.observaciones}</p>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="text-sm font-bold text-gray-900 mb-3">Ítems Verificados</h4>
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
