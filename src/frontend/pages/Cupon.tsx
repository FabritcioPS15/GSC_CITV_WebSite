import React, { useState, useEffect } from 'react';
import { Ticket, CheckCircle2, Send, ArrowRight, ShieldCheck, Mail, Phone, Info } from 'lucide-react';
import PremiumButton from '../components/PremiumButton';
import RevealOnScroll from '../components/RevealOnScroll';
import { Helmet } from 'react-helmet-async';
import { scrollToTop } from '../components/SmoothScroll';

const CuponPage: React.FC = () => {
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        plate: '',
        vehicleType: 'liviano'
    });

    useEffect(() => {
        scrollToTop();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí se vincularía con Google Sheets mediante un endpoint o Formspree/Google Form Action
        console.log('Formulario enviado:', formData);
        setStep('success');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Helmet>
                <title>Obtén tu Cupón de Descuento | Grupo San Cristóbal</title>
                <meta name="description" content="Regístrate y obtén un cupón de descuento exclusivo para tu próxima revisión técnica vehicular." />
            </Helmet>

            {/* Hero Section del Cupón */}
            <section className="relative pt-20 pb-32 overflow-hidden bg-black text-white">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[50%] h-full bg-[#f97316]/10 transform skew-x-[-15deg] translate-x-32" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(249,115,22,0.1),transparent_70%)]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-4 mb-8 animate-grow-vertical">
                            <div className="w-1.5 h-16 bg-[#f97316] rounded-full shadow-[0_0_20px_rgba(249,115,22,0.6)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#f97316]">Promoción Exclusiva Web</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter uppercase animate-grow-text">
                            Ahorra en tu <br />
                            <span className="text-[#f97316]">Revisión Técnica</span>
                        </h1>
                        <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-xl animate-entry-fade">
                            Completa tus datos y recibe un cupón de descuento directo para usarlo en cualquiera de nuestras sedes a nivel nacional.
                        </p>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="relative z-20 -mt-16 pb-32 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Form Card */}
                    <div className="lg:col-span-7">
                        <RevealOnScroll>
                            <div className="bg-white rounded-[40px] shadow-2xl shadow-black/5 overflow-hidden border border-gray-100">
                                {step === 'form' ? (
                                    <div className="p-8 md:p-12">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                                                <Ticket className="text-white" size={28} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Formulario de <span className="text-orange-500">Registro</span></h2>
                                                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Recibe tu cupón en segundos</p>
                                            </div>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre y Apellido</label>
                                                    <input 
                                                        required
                                                        type="text" 
                                                        placeholder="Juan Pérez"
                                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-bold text-gray-900"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp / Celular</label>
                                                    <input 
                                                        required
                                                        type="tel" 
                                                        placeholder="999 999 999"
                                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-bold text-gray-900"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                                                <input 
                                                    required
                                                    type="email" 
                                                    placeholder="juan@ejemplo.com"
                                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-bold text-gray-900"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Número de Placa (Sin guion)</label>
                                                    <input 
                                                        required
                                                        type="text" 
                                                        placeholder="ABC123"
                                                        maxLength={6}
                                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-bold text-gray-900 uppercase"
                                                        value={formData.plate}
                                                        onChange={(e) => setFormData({...formData, plate: e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()})}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipo de Vehículo</label>
                                                    <div className="relative">
                                                        <select 
                                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-bold text-gray-900 appearance-none cursor-pointer"
                                                            value={formData.vehicleType}
                                                            onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                                                        >
                                                            <option value="liviano">Particular / Camioneta</option>
                                                            <option value="pesado">Pesado (Bus / Camión)</option>
                                                            <option value="moto">Moto / Trimoto</option>
                                                            <option value="taxi">Taxi / Público</option>
                                                        </select>
                                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                            <ArrowRight size={18} className="rotate-90" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-6">
                                                <PremiumButton type="submit" className="w-full py-6 text-xl gap-3 !rounded-2xl">
                                                    <Send size={22} />
                                                    GENERAR MI CUPÓN AHORA
                                                </PremiumButton>
                                            </div>

                                            <div className="flex items-center gap-3 justify-center pt-4">
                                                <ShieldCheck size={16} className="text-green-500" />
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sus datos están protegidos y son confidenciales</span>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center">
                                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/10 animate-bounce">
                                            <CheckCircle2 size={48} />
                                        </div>
                                        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase">¡Cupón Generado!</h2>
                                        <p className="text-lg text-gray-500 font-medium leading-relaxed mb-10 max-w-md mx-auto">
                                            Hola <span className="text-gray-900 font-black">{formData.name}</span>, hemos enviado tu cupón a tu correo y lo registraremos para la placa <span className="text-orange-500 font-black">{formData.plate}</span>.
                                        </p>
                                        
                                        <div className="bg-orange-50 border-4 border-dashed border-orange-200 p-10 rounded-[40px] mb-12 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200/20 rounded-full -translate-y-12 translate-x-12 blur-2xl" />
                                            <p className="text-[11px] font-black text-orange-400 uppercase tracking-[0.4em] mb-4">CÓDIGO EXCLUSIVO</p>
                                            <p className="text-6xl md:text-7xl font-black text-orange-600 tracking-tighter group-hover:scale-110 transition-transform">WEB2024</p>
                                            <div className="mt-6 flex items-center justify-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Válido en todas las sedes</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <PremiumButton href="/" className="bg-black hover:bg-gray-800 text-white py-5 !rounded-2xl shadow-xl">
                                                Ir al Inicio
                                            </PremiumButton>
                                            <PremiumButton href="/sedes" className="bg-white border-2 border-orange-500 !text-orange-500 py-5 !rounded-2xl shadow-xl hover:bg-orange-50 transition-colors">
                                                Ver Sedes
                                            </PremiumButton>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </RevealOnScroll>
                    </div>

                    {/* Info Side */}
                    <div className="lg:col-span-5 space-y-8">
                        <RevealOnScroll className="delay-200">
                            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-black/5">
                                <h3 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">¿Cómo <span className="text-orange-500">funciona?</span></h3>
                                <div className="space-y-8">
                                    {[
                                        { icon: <Send size={20} />, title: "Regístrate", text: "Llena el formulario con tus datos reales para generar el código." },
                                        { icon: <Mail size={20} />, title: "Recibe el Código", text: "Te enviaremos el cupón a tu correo electrónico y WhatsApp de forma automática." },
                                        { icon: <Ticket size={20} />, title: "Menciona en Sede", text: "Al llegar a cualquiera de nuestras sedes, muestra tu código y obtén el descuento." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 uppercase tracking-tight mb-1">{item.title}</h4>
                                                <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </RevealOnScroll>

                        <RevealOnScroll className="delay-400">
                            <div className="bg-orange-500 rounded-[40px] p-10 text-white shadow-2xl shadow-orange-500/30 overflow-hidden relative group">
                                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Info size={24} className="text-white" />
                                        <h3 className="text-xl font-black uppercase tracking-tight">Importante</h3>
                                    </div>
                                    <ul className="space-y-4">
                                        {[
                                            "Válido por tiempo limitado.",
                                            "No acumulable con otras promos.",
                                            "Aplica para todo tipo de vehículos.",
                                            "Sujeto a disponibilidad de sede."
                                        ].map((text, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm font-bold text-orange-50/90 leading-snug">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                                                {text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CuponPage;
