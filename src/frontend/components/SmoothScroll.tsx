import { useEffect } from 'react';
import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function scrollToTop(): void {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: true, force: true });
  } else {
    window.scrollTo(0, 0);
  }
}

/** Alto del header fijo, para que el ancla no quede tapada al saltar. */
const HEADER_OFFSET = -90;

/** Desplaza hasta un ancla usando Lenis, con el offset del header fijo. */
export function scrollToEl(el: HTMLElement): void {
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset: HEADER_OFFSET, force: true });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisInstance = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return null;
}
