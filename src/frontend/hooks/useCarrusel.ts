import { useCallback, useEffect, useRef, useState } from 'react';

interface OpcionesCarrusel {
    /** Cantidad de slides. */
    total: number;
    /** Milisegundos entre cambio automático. */
    autoplayMs?: number;
}

/**
 * Carrusel de una card a la vez en móvil, con avance automático y puntos.
 *
 * El marcado que usa el hook tiene que ser un track scrolleable en móvil que se
 * convierta en grilla a partir de `md`, con un hijo por slide:
 *
 *   <section ref={seccionRef}>
 *     <div ref={trackRef} onScroll={alDesplazar} onPointerDown={pausar}
 *          className="flex md:grid overflow-x-auto snap-x md:overflow-visible">
 *       {items.map(...)}   // w-full snap-center md:w-auto
 *     </div>
 *   </section>
 *
 * Comportamiento:
 * - Avanza solo si la sección está en pantalla y el usuario no la está tocando.
 * - Se frena con prefers-reduced-motion.
 * - `irA` da salto directo, para los puntos.
 */
export function useCarrusel({ total, autoplayMs = 10000 }: OpcionesCarrusel) {
    const [index, setIndex] = useState(0);
    const [pausado, setPausado] = useState(false);
    const [visible, setVisible] = useState(false);

    const trackRef = useRef<HTMLDivElement | null>(null);
    const seccionRef = useRef<HTMLElement | null>(null);
    // Marca el scroll que dispara el autoplay, para que onScroll no cambie el
    // punto activo mientras la animación va por el camino.
    const moviendoRef = useRef(false);

    const irA = useCallback((i: number) => {
        const siguiente = ((i % total) + total) % total;
        const track = trackRef.current;
        const card = track?.children[siguiente] as HTMLElement | undefined;
        if (track && card) {
            moviendoRef.current = true;
            track.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
            window.setTimeout(() => { moviendoRef.current = false; }, 600);
        }
        setIndex(siguiente);
    }, [total]);

    // El autoplay solo corre con la sección a la vista: si no, el timer gastaría
    // bubbling slides que nadie llega a ver.
    useEffect(() => {
        const nodo = seccionRef.current;
        if (!nodo) return;
        const io = new IntersectionObserver(
            ([e]) => setVisible(e.isIntersecting),
            { threshold: 0.25 }
        );
        io.observe(nodo);
        return () => io.disconnect();
    }, []);

    // setTimeout encadenado en vez de setInterval: así cada cambio reinicia el
    // timer y se respeta la pausa real entre slide y slide.
    useEffect(() => {
        if (!visible || pausado) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const id = window.setTimeout(() => irA(index + 1), autoplayMs);
        return () => window.clearTimeout(id);
    }, [visible, pausado, index, autoplayMs, irA]);

    /** Sincroniza el punto activo con la slide que quedó a la vista al arrastrar. */
    const alDesplazar = useCallback(() => {
        if (moviendoRef.current) return;
        const track = trackRef.current;
        // En desktop el track es grilla y no scrollea: no hay nada que sincronizar.
        if (!track || track.scrollWidth <= track.clientWidth) return;
        let mejor = 0;
        let mejorDiff = Infinity;
        Array.from(track.children).forEach((hijo, i) => {
            const d = Math.abs((hijo as HTMLElement).offsetLeft - track.scrollLeft);
            if (d < mejorDiff) {
                mejorDiff = d;
                mejor = i;
            }
        });
        setIndex(mejor);
    }, []);

    return {
        index,
        irA,
        pausar: useCallback(() => setPausado(true), []),
        alDesplazar,
        trackRef,
        seccionRef,
    };
}
