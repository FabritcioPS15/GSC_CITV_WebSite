import React from 'react';
import { FaFacebook, FaInstagram, FaTiktok, FaPhoneAlt, FaEnvelope, FaClock } from 'react-icons/fa';
import RevealOnScroll from '../components/RevealOnScroll';
import { Helmet } from 'react-helmet-async';
import PremiumButton from '../components/PremiumButton';
import { socialLinks } from '../../backend/data/social';
import { EMAIL_CONTACTO, TELEFONO_CONTACTO } from '../../backend/data/contacto';

const socialIcons: Record<string, React.ReactNode> = {
    Facebook: <FaFacebook size={20} />,
    Instagram: <FaInstagram size={20} />,
    TikTok: <FaTiktok size={20} />,
};

function Contacto() {
    return (
        <div>
            <Helmet>
                <title>Contacto | Ponte en Contacto - Revisiones Técnicas Vehiculares</title>
                <meta name="description" content="Contáctanos para consultas sobre revisiones técnicas vehiculares, sedes, requisitos y servicios corporativos. Atención personalizada y soporte técnico." />
                <meta name="keywords" content="contacto, atencion al cliente, soporte revision tecnica, consultas vehiculares, informacion sedes, ayuda MTC" />
                <link rel="canonical" href="https://tu-dominio.com/contacto" />
            </Helmet>
            {/* Standardized Left-Aligned Banner (Compact) */}
            <section className="page-banner">
                {/* Background Layer */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                        alt="Contacto"
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
                                    Contác<span className="text-orange-500">tanos</span>
                                </h1>
                                <p className="banner-description text-gray-400">
                                    Estamos aquí para atenderte. Ponte en contacto con nosotros para cualquier consulta sobre nuestras revisiones técnicas o servicios corporativos.
                                </p>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>

                {/* Bottom Decorative Detail */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-orange-500/0 to-transparent opacity-50" />
            </section>

            <RevealOnScroll>
                <section className="max-w-7xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Información de Contacto */}
                        <div>
                            <h2 className="text-3xl font-bold mb-8">Información de Contacto</h2>
                            <p className="content-text text-gray-600 mb-8">
                                Ponte en contacto con nosotros para cualquier consulta sobre nuestras revisiones técnicas o servicios corporativos.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="bg-black text-white p-3">
                                        <FaPhoneAlt size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Teléfono</h3>
                                        <a href={`tel:${TELEFONO_CONTACTO.replace(/\s/g, '')}`} className="content-text text-gray-600 hover:text-orange-600 transition-colors">
                                            {TELEFONO_CONTACTO}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="bg-black text-white p-3">
                                        <FaEnvelope size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Email</h3>
                                        <a href={`mailto:${EMAIL_CONTACTO}`} className="content-text text-gray-600 hover:text-orange-600 transition-colors break-words">
                                            {EMAIL_CONTACTO}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="bg-black text-white p-3">
                                        <FaClock size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Horario de Atención</h3>
                                        <p className="content-text text-gray-600">Lunes a Sábado: 8:00 AM - 6:00 PM</p>
                                        <p className="content-text text-gray-600">Domingo: Cerrado</p>
                                    </div>
                                </div>
                            </div>

                            {/* Redes Sociales */}
                            <div className="mt-12">
                                <h3 className="text-2xl font-bold mb-2">Síguenos en redes</h3>
                                <p className="content-text text-gray-600 mb-6">
                                    Escríbenos o síguenos para estar al tanto de nuestras sedes, promociones y novedades de seguridad vehicular.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {socialLinks.map((s, i) => (
                                        <a
                                            key={i}
                                            href={s.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-4 border-2 border-gray-200 px-5 py-4 hover:border-orange-500 transition-colors duration-300"
                                        >
                                            <span className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center shrink-0 group-hover:bg-orange-500 transition-colors duration-300">
                                                {socialIcons[s.name]}
                                            </span>
                                            <span className="flex flex-col">
                                                <span className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                                    {s.name}
                                                </span>
                                                <span className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                                                    @gruposancristobal
                                                </span>
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Formulario */}
                        <div className="bg-white border-2 border-black p-8">
                            <h2 className="text-2xl font-bold mb-6">Envíanos un mensaje</h2>
                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre Completo
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-2 border border-gray-300 focus:ring-black focus:border-black"
                                        placeholder="Tu nombre"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-2 border border-gray-300 focus:ring-black focus:border-black"
                                        placeholder="tu@email.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        className="w-full px-4 py-2 border border-gray-300 focus:ring-black focus:border-black"
                                        placeholder="+51 999 999 999"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                        Mensaje
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 focus:ring-black focus:border-black"
                                        placeholder="¿En qué podemos ayudarte?"
                                    ></textarea>
                                </div>

                                <PremiumButton
                                    type="submit"
                                    className="w-full py-4 px-6"
                                >
                                    Enviar Mensaje
                                </PremiumButton>
                            </form>
                        </div>
                    </div>
                </section>
            </RevealOnScroll>
        </div>
    );
}

export default Contacto;

