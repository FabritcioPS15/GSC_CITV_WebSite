import { useEffect } from 'react';

interface LoaderProps {
    onComplete?: () => void;
}

const Loader = ({ onComplete }: LoaderProps) => {
    useEffect(() => {
        if (onComplete) {
            const timer = setTimeout(() => {
                onComplete();
            }, 1450);
            return () => clearTimeout(timer);
        }
    }, [onComplete]);

    return (
        <div className="loader-container">
            <div className="fluid-loader-wrapper">
                <img 
                    src="/LogoRTPSanCristobal_horizontal.png" 
                    alt="Cargando..." 
                    className="fluid-loader-base"
                />
                <div className="fluid-loader-fill-container">
                    <img 
                        src="/LogoRTPSanCristobal_horizontal.png" 
                        alt="Cargando..." 
                        className="fluid-loader-fill"
                    />
                </div>
            </div>
        </div>
    );
}

export default Loader;
