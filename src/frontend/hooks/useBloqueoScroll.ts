import { useEffect } from 'react';
import { getLenis } from '../components/SmoothScroll';

/**
 * Bloquea el scroll del documento mientras hay un overlay abierto (modal,
 * menú móvil, etc.), de modo que el gesto de deslizar solo afecte al contenido
 * del overlay y no a la página de fondo.
 *
 * Hacen falta las dos piezas:
 * - `position: fixed` en el body, porque en iOS Safari el documento sigue
 *   desplazándose por inercia aunque tenga `overflow: hidden`.
 * - `lenis.stop()`, porque el scroll suave de la web intercepta rueda y gestos
 *   táctiles y sigue llamando a `window.scrollTo` por debajo del overflow.
 *
 * Al cerrar se restaura la posición con la que se abrió, para que la página no
 * salte de vuelta al inicio.
 */
export function useBloqueoScroll(activo: boolean) {
    useEffect(() => {
        if (!activo) return;

        const body = document.body;
        const scrollY = window.scrollY;
        const lenis = getLenis();
        lenis?.stop();

        const estilosAnteriores = {
            position: body.style.position,
            top: body.style.top,
            width: body.style.width,
            overflowY: body.style.overflowY,
            paddingRight: body.style.paddingRight
        };

        // Compensa el ancho de la barra de scroll para que el layout no salte
        // horizontalmente al desaparecerla.
        const barraScroll = window.innerWidth - document.documentElement.clientWidth;
        if (barraScroll > 0) {
            const paddingActual = parseInt(window.getComputedStyle(body).paddingRight, 10) || 0;
            body.style.paddingRight = `${paddingActual + barraScroll}px`;
        }

        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.width = '100%';
        body.style.overflowY = 'scroll';

        return () => {
            body.style.position = estilosAnteriores.position;
            body.style.top = estilosAnteriores.top;
            body.style.width = estilosAnteriores.width;
            body.style.overflowY = estilosAnteriores.overflowY;
            body.style.paddingRight = estilosAnteriores.paddingRight;
            // Lenis lleva su propia posición interna: si solo se restaurara con
            // window.scrollTo, el siguiente fotograma volvería al valor viejo.
            if (lenis) {
                lenis.start();
                lenis.scrollTo(scrollY, { immediate: true, force: true });
            } else {
                window.scrollTo(0, scrollY);
            }
        };
    }, [activo]);
}