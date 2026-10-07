import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import rtvLogo from '../../resources/logos/RTV LOGO CIRCULAR.png';

export default function WelcomePopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasSeenPopup = localStorage.getItem('hasSeenWelcomePopup');
        if (!hasSeenPopup) {
            // Show popup after a short delay
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('hasSeenWelcomePopup', 'true');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100 animate-scale-in">
                {/* Decorative header background */}
                <div className="h-40 relative group overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Welcome"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-1"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                        <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center overflow-hidden">
                            <img src={rtvLogo} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-8 px-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        ¡Bienvenido a RTP San Cristóbal!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Expertos en revisiones técnicas vehiculares. Garantizamos tu seguridad y la de tu vehículo con el mejor servicio.
                    </p>

                    <button
                        onClick={handleClose}
                        className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        Continuar al sitio
                    </button>
                </div>
            </div>
        </div>
    );
}
