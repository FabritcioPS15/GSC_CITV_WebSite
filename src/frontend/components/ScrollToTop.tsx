import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from './SmoothScroll';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [pathname]);

  return null;
}
