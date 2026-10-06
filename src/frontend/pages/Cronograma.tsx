import { Search, Car, Fuel, AlertCircle, ExternalLink } from 'lucide-react';
import Seo from '../components/Seo';
import RevealOnScroll from '../components/RevealOnScroll';
import InspectionWheel from '../components/InspectionWheel';

const helmetContent = (
    <Seo
        path="/cronograma"
        title="Cronograma de Revisión Técnica Vehicular 2026 | Grupo San Cristóbal"
        description="Consulta el cronograma de revisión técnica vehicular en el Perú: fechas límite por placa, consulta de revisión, certificación de gas y renovación del certificado MTC."
        keywords={['cronograma revisión técnica 2026', 'plazo revisión técnica vehicular', 'fecha de revisión técnica por placa', 'cronograma MTC Perú']}
    />
);

// Datos del cronograma por mes
const cronogramaData = [
    {
        mes: 'Enero 2026',
        ultimoDigito: '1 y 2',
        fechas: '15-20 Enero',
        estado: 'completado',
        descripcion: 'Placas terminadas en 1 y 2'
    },
    {
        mes: 'Febrero 2026',
        ultimoDigito: '3 y 4',
        fechas: '15-20 Febrero',
        estado: 'completado',
        descripcion: 'Placas terminadas en 3 y 4'
    },
    {
        mes: 'Marzo 2026',
        ultimoDigito: '5 y 6',
        fechas: '15-20 Marzo',
        estado: 'activo',
        descripcion: 'Placas terminadas en 5 y 6'
    },
    {
        mes: 'Abril 2026',
        ultimoDigito: '7 y 8',
        fechas: '15-20 Abril',
        estado: 'pendiente',
        descripcion: 'Placas terminadas en 7 y 8'
    },
    {
        mes: 'Mayo 2026',
        ultimoDigito: '9 y 0',
        fechas: '15-20 Mayo',
        estado: 'pendiente',
        descripcion: 'Placas terminadas en 9 y 0'
    },
    {
        mes: 'Junio 2026',
        ultimoDigito: '1 y 2',
        fechas: '15-20 Junio',
        estado: 'futuro',
        descripcion: 'Placas terminadas en 1 y 2'
    }
];

function Cronograma() {
    return (
        <>
            {helmetContent}
            <div className="min-h-screen bg-[#f8fafc]">
                {/* HERO SECTION */}
                <section className="page-banner">
                    <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />

                    <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
                        <RevealOnScroll>
                            <div className="max-w-3xl flex items-center gap-6 group">
                                <div className="w-1.5 h-20 bg-orange-500 rounded-full shrink-0 animate-grow-vertical" />
                                <div className="space-y-4">
                                    <h1 className="banner-title text-white animate-grow-text">
                                        Cronograma y <span className="text-orange-500">Consultas</span>
                                    </h1>
                                    <p className="banner-description text-gray-400 max-w-2xl">
                                        Consulta tu placa, verifica tu revisión técnica y certificación de gas. Todo en un solo lugar.
                                    </p>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>

                    {/* Bottom Decorative Detail */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-orange-500/0 to-transparent opacity-50" />
                </section>

                <div className="max-w-7xl mx-auto px-4 pt-12 -mb-8">
                    {/* BOTONES DE CONSULTA */}
                    <RevealOnScroll>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <a
                                href="https://consultavehicular.sunarp.gob.pe/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-orange-100 p-3 rounded-xl group-hover:bg-black transition-colors">
                                        <Search size={24} className="text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 mb-1">Consulta Placa</h3>
                                        <p className="text-sm text-gray-600">Verifica tu vehÃ­culo</p>
                                    </div>
                                    <ExternalLink size={18} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                                </div>
                            </a>

                            <a
                                href="https://rec.mtc.gob.pe/Citv/ArConsultaCitv"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-orange-100 p-3 rounded-xl group-hover:bg-black transition-colors">
                                        <Car size={24} className="text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 mb-1">Revisión Técnica</h3>
                                        <p className="text-sm text-gray-600">Consulta tu certificado</p>
                                    </div>
                                    <ExternalLink size={18} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                                </div>
                            </a>

                            <a
                                href="https://vh.infogas.com.pe/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-orange-100 p-3 rounded-xl group-hover:bg-black transition-colors">
                                        <Fuel size={24} className="text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 mb-1">Gas (GNV/GLP)</h3>
                                        <p className="text-sm text-gray-600">CertificaciÃ³n de gas</p>
                                    </div>
                                    <ExternalLink size={18} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                                </div>
                            </a>
                        </div>
                    </RevealOnScroll>
                </div>

                <InspectionWheel />

                <div className="max-w-7xl mx-auto px-4 py-12">
                    {/* CRONOGRAMA */}
                    <RevealOnScroll>
                        <div className="space-y-6">


                            {/* Nota */}
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                <div className="flex items-start gap-4">
                                    <AlertCircle className="text-gray-400 flex-shrink-0 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-2 text-sm">Nota Importante</h4>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            Este cronograma es referencial. Verifica siempre la fecha exacta en tu tarjeta de propiedad
                                            o consulta directamente con el MTC, ya que las fechas pueden variar segÃºn disposiciones oficiales.
                                            El incumplimiento de la inspecciÃ³n en el mes asignado conlleva multas y recargos adicionales,
                                            y las citas estÃ¡n sujetas a disponibilidad segÃºn la sede elegida.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>
        </>
    );
}

export default Cronograma;
