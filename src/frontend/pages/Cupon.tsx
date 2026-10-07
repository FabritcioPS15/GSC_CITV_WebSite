import React, { useState, useEffect } from 'react';
import { Ticket, CheckCircle2, Send, ShieldCheck, Mail, Info, ChevronDown } from 'lucide-react';
import PremiumButton from '../components/PremiumButton';
import RevealOnScroll from '../components/RevealOnScroll';
import Seo from '../components/Seo';
import { scrollToTop } from '../components/SmoothScroll';
import { schemaBreadcrumbs } from '../seo/schemas';

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
        <div className="min-h-screen bg-[#f8fafc]">
            <Seo
                path="/cupon"
                title="Cupón de Descuento para Revisión Técnica | RTP San Cristóbal"
                description="Registra tus datos y obtén un cupón de descuento para tu revisión técnica vehicular. Válido en todas las sedes de RTP San Cristóbal en el Perú, para autos, camionetas, motos y vehículos pesados."
                keywords={['cupón revisión técnica', 'descuento revisión vehicular', 'promo revisión técnica Perú', 'cupón inspección técnica']}
                schema={schemaBreadcrumbs([
                    { name: 'Inicio', path: '/' },
                    { name: 'Cupón', path: '/cupon' }
                ])}
            />

            {/* Hero Section. Misma plantilla `page-banner` que el resto de páginas:
                alto controlado por la clase, título `banner-title` y descripción
                `banner-description`, en lugar de un bloque propio con h1 de 7xl. */}
            <section className="page-banner">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                        alt="Cupón de descuento"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
                    <RevealOnScroll>
                        <div className="max-w-3xl flex items-center gap-6 group">
                            <div className="w-1.5 h-20 bg-orange-500 rounded-full shrink-0 animate-grow-vertical" />
                            <div className="space-y-4">
                                <h1 className="banner-title text-white animate-grow-text">
                                    Cupón de <span className="text-orange-500">Descuento</span>
                                </h1>
                                <p className="banner-description text-gray-400 max-w-2xl">
                                    Registra tus datos y recibe un cupón de descuento para tu próxima revisión técnica vehicular en cualquiera de nuestras sedes.
                                </p>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>

                {/* Bottom Decorative Detail */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-orange-500/0 to-transparent opacity-50" />
            </section>

            {/* Form Section */}
            <section className="section max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Form Card */}
                    <div className="lg:col-span-7">
                        <RevealOnScroll>
                            <div className="bg-white border-2 border-black">
                                {step === 'form' ? (
                                    <div className="p-8">
                                        <h2 className="text-2xl font-bold mb-6">Formulario de Registro</h2>
                                        <p className="content-text text-gray-600 mb-8">
                                            Completa tus datos para recibir tu cupón de descuento en cualquiera de nuestras sedes.
                                        </p>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div>
                                                <label htmlFor="cupon-name" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nombre Completo
                                                </label>
                                                <input
                                                    required
                                                    id="cupon-name"
                                                    type="text"
                                                    className="w-full px-4 py-2 border border-gray-300 focus:ring-black focus:border-black"
                                                    placeholder="Juan Pérez"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="cupon-email" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Correo Electrónico
                                                </label>
                                                <input
                                                    required
                                                    id="cupon-email"
                                                    type="email"
                                                    className="w-full px-4 py-2 border border-gray-300 focus:ring-black focus:border-black"
                                                    placeholder="tu@email.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="cupon-phone" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Teléfono
                                                </label>
                                                <input
                                                    required
                                                    id="cupon-phone"
                                                    type="tel"
                                                    className="w-full px-4 py-2 border border-gray-300 focus:ring-black focus:border-black"
                                                    placeholder="+51 999 999 999"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="cupon-plate" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Número de Placa
                                                </label>
                                                <input
                                                    required
                                                    id="cupon-plate"
                                                    type="text"
                                                    maxLength={6}
                                                    className="w-full px-4 py-2 border border-gray-300 focus:ring-black focus:border-black uppercase"
                                                    placeholder="ABC123"
                                                    value={formData.plate}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            plate: e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="cupon-vehicle" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Tipo de Vehículo
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        id="cupon-vehicle"
                                                        className="w-full px-4 py-2 pr-10 border border-gray-300 focus:ring-black focus:border-black bg-white appearance-none cursor-pointer"
                                                        value={formData.vehicleType}
                                                        onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                                                    >
                                                        <option value="liviano">Particular / Camioneta</option>
                                                        <option value="pesado">Pesado (Bus / Camión)</option>
                                                        <option value="moto">Moto / Trimoto</option>
                                                        <option value="taxi">Taxi / Público</option>
                                                    </select>
                                                    <ChevronDown
                                                        size={16}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <ShieldCheck size={16} className="text-green-500 shrink-0" />
                                                <span className="content-text text-gray-600">
                                                    Tus datos están protegidos y son confidenciales.
                                                </span>
                                            </div>

                                            <PremiumButton type="submit" className="w-full py-4 px-6">
                                                Generar mi cupón
                                            </PremiumButton>
                                        </form>
                                    </div>
                                ) : (
<div className="p-8 text-center">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle2 size={32} />
                                        </div>
                                        <h2 className="text-2xl font-bold mb-4">¡Cupón generado!</h2>
                                        <p className="content-text text-gray-600 mb-8">
                                            Hola <span className="font-semibold text-gray-900">{formData.name}</span>, hemos enviado tu cupón a tu correo y lo registraremos para la placa{' '}
                                            <span className="font-semibold text-orange-600 uppercase">{formData.plate}</span>.
                                        </p>

                                        <div className="bg-orange-50 border-2 border-dashed border-orange-200 p-8 mb-8">
                                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-3">Código exclusivo</p>
                                            <p className="text-4xl font-black text-orange-600 tracking-tight">WEB2024</p>
                                            <div className="mt-4 flex items-center justify-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                                <span className="content-text text-orange-600">Válido en todas las sedes</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <PremiumButton href="/" plain className="bg-black hover:bg-gray-800 text-white py-4">
                                                Ir al Inicio
                                            </PremiumButton>
                                            <PremiumButton href="/sedes" plain className="bg-white border-2 border-orange-500 !text-orange-600 py-4 hover:bg-orange-50 transition-colors">
                                                Ver Sedes
                                            </PremiumButton>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </RevealOnScroll>
                    </div>

                    {/* Info Side */}
                    <div className="lg:col-span-5 space-y-6">
                        <RevealOnScroll className="delay-200">
                            <div className="bg-white p-8 border border-gray-200">
                                <h3 className="text-xl font-bold mb-6">¿Cómo funciona?</h3>
                                <div className="space-y-6">
                                    {[
                                        { icon: <Send size={18} />, title: "Regístrate", text: "Llena el formulario con tus datos reales para generar el código." },
                                        { icon: <Mail size={18} />, title: "Recibe el Código", text: "Te enviaremos el cupón a tu correo electrónico y WhatsApp de forma automática." },
                                        { icon: <Ticket size={18} />, title: "Menciona en Sede", text: "Al llegar a cualquiera de nuestras sedes, muestra tu código y obtén el descuento." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                                                <p className="content-text text-gray-600">{item.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </RevealOnScroll>

                        <RevealOnScroll className="delay-400">
                            <div className="bg-orange-500 p-8 text-white">
                                <div className="flex items-center gap-3 mb-5">
                                    <Info size={20} className="text-white shrink-0" />
                                    <h3 className="text-lg font-bold">Importante</h3>
                                </div>
                                <ul className="space-y-3">
                                    {[
                                        "Válido por tiempo limitado.",
                                        "No acumulable con otras promos.",
                                        "Aplica para todo tipo de vehículos.",
                                        "Sujeto a disponibilidad de sede."
                                    ].map((text, i) => (
                                        <li key={i} className="flex items-start gap-3 content-text text-orange-50 leading-snug">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0" />
                                            {text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CuponPage;
