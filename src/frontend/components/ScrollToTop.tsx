import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop, scrollToEl } from './SmoothScroll';

/**
 * Al cambiar de ruta sube al inicio, salvo que la ruta traiga un ancla
 * (por ejemplo /sedes#mapa), en cuyo caso salta a esa sección.
 *
 * No alcanza con letting el navegador hacerlo: las páginas van por lazy, así que
 * al entrar a /sedes el section#mapa todavia no esta en el DOM. Por eso se
 * reintenta en un rAF hasta que aparezca, con un tope para no esperar eterno si
 * el ancla esta mal escrita.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      scrollToTop();
      return;
    }

    let intentos = 0;
    let raf = 0;

    const intentar = () => {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        scrollToEl(el);
        return;
      }
      if (++intentos < 90) raf = requestAnimationFrame(intentar);
    };

    raf = requestAnimationFrame(intentar);
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  return null;
}
