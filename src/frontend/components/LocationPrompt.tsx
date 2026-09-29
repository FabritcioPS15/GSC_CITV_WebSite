import { useState, useEffect } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';
import { getConsent, onConsentChange } from '../utils/consent';

const LocationPrompt = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [status, setStatus] = useState<'idle' | 'requesting' | 'success' | 'error'>('idle');

    useEffect(() => {
        // Solo mostrar si no se ha respondido antes y si el usuario,autoriza geolocalización
        const hasAskedLocation = localStorage.getItem('hasAskedLocation');

        if (hasAskedLocation || !getConsent().location) {
            return;
        }

        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // Si el usuario cambia sus preferencias y rechaza la geolocalización, cerrar el aviso
    useEffect(() => {
        return onConsentChange((consent) => {
            if (!consent.location) {
                setIsVisible(false);
            }
        });
    }, []);

    const handleAllow = () => {
        setStatus('requesting');
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setStatus('success');
                    // Store coordinates in session or local storage for global access
                    sessionStorage.setItem('userLat', position.coords.latitude.toString());
                    sessionStorage.setItem('userLon', position.coords.longitude.toString());
                    localStorage.setItem('hasAskedLocation', 'allowed');

                    setTimeout(() => {
                        setIsVisible(false);
                    }, 1500);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setStatus('error');
                    localStorage.setItem('hasAskedLocation', 'denied');
                    setTimeout(() => setIsVisible(false), 2000);
                }
            );
        } else {
            setStatus('error');
            setTimeout(() => setIsVisible(false), 2000);
        }
    };

    const handleDecline = () => {
        localStorage.setItem('hasAskedLocation', 'denied');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[120] w-[90%] max-w-sm animate-in fade-in slide-in-from-top-10 duration-500">
            <div className="bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 overflow-hidden">
                <div className="relative p-6">
                    <button
                        onClick={handleDecline}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={18} />
                    </button>

                    <div className="flex flex-col items-center text-center gap-4 mt-2">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center animate-pulse">
                            <MapPin className="text-orange-600 w-8 h-8" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-gray-900">¿Encontrar sede cercana?</h3>
                            <p className="text-sm text-gray-500 leading-relaxed px-2">
                                Comparte tu ubicación para mostrarte automáticamente las plantas de revisión técnica más próximas a tu posición actual.
                            </p>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-3 mt-2">
                            <button
                                onClick={handleDecline}
                                className="px-4 py-3 rounded-2xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition-colors border border-gray-100"
                            >
                                Después
                            </button>
                            <button
                                onClick={handleAllow}
                                disabled={status === 'requesting'}
                                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95 disabled:opacity-70"
                            >
                                {status === 'requesting' ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : status === 'success' ? (
                                    <Navigation size={16} className="animate-bounce" />
                                ) : (
                                    "Sí, activar"
                                )}
                            </button>
                        </div>

                        {status === 'success' && (
                            <p className="text-xs text-green-600 font-medium animate-bounce mt-1 italic">
                                ¡Ubicación activada correctamente!
                            </p>
                        )}
                        {status === 'error' && (
                            <p className="text-xs text-red-500 font-medium mt-1">
                                No pudimos acceder a tu ubicación.
                            </p>
                        )}
                    </div>
                </div>

                {/* Progress bar accent */}
                <div className="h-1.5 w-full bg-gray-50">
                    <div className="h-full bg-orange-500 transition-all duration-[3000ms] ease-linear w-full"></div>
                </div>
            </div>
        </div>
    );
};

export default LocationPrompt;
