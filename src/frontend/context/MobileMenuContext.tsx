import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface MobileMenuValue {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
    toggle: () => void;
}

const MobileMenuContext = createContext<MobileMenuValue | null>(null);

/**
 * Estado del menú móvilDrawer.
 *
 * Vive acá y no dentro del Header porque el botón flotante de WhatsApp
 * también lo necesita: si el drawer está abierto, el flotante se oculta para
 * no quedar tapado ni competir con los controles del menú.
 */
export function MobileMenuProvider({ children }: { children: ReactNode }) {
    const [isOpen, setOpen] = useState(false);
    const value = useMemo<MobileMenuValue>(
        () => ({ isOpen, setOpen, toggle: () => setOpen((o) => !o) }),
        [isOpen]
    );
    return <MobileMenuContext.Provider value={value}>{children}</MobileMenuContext.Provider>;
}

export function useMobileMenu(): MobileMenuValue {
    const ctx = useContext(MobileMenuContext);
    if (!ctx) throw new Error('useMobileMenu debe usarse dentro de MobileMenuProvider');
    return ctx;
}
