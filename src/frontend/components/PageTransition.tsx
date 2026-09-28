import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Loader from './Loader';
import { scrollToTop } from './SmoothScroll';

interface PageTransitionProps {
    children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
    const location = useLocation();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [displayLocation, setDisplayLocation] = useState(location);

    useEffect(() => {
        if (location.pathname !== displayLocation.pathname) {
            // Start transition
            setIsTransitioning(true);

            // Delay for the smooth, natural fluid wave animation to play completely
            const timer = setTimeout(() => {
                setDisplayLocation(location);
                setIsTransitioning(false);
                scrollToTop(); // Scroll to top on page change
            }, 1450); // Gives time to appreciate the fluid wave effect

            return () => clearTimeout(timer);
        }
    }, [location.pathname, displayLocation.pathname]);

    return (
        <>
            {isTransitioning ? (
                <div className="flex items-center justify-center h-[100dvh] w-full bg-white fixed inset-0 z-[9999]">
                    <Loader />
                </div>
            ) : (
                <div className="fadeIn">
                    {children}
                </div>
            )}
        </>
    );
}
