const STORAGE_KEY = 'cookieConsent';

export interface ConsentState {
  location: boolean;
  routes: boolean;
  analytics: boolean;
}

const DENY_ALL: ConsentState = { location: false, routes: false, analytics: false };

export const getConsent = (): ConsentState => {
  if (typeof window === 'undefined') return DENY_ALL;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DENY_ALL;
    const parsed = JSON.parse(raw) as { prefs?: Partial<ConsentState> };
    return {
      location: !!parsed.prefs?.location,
      routes: !!parsed.prefs?.routes,
      analytics: !!parsed.prefs?.analytics,
    };
  } catch {
    return DENY_ALL;
  }
};

export const hasConsent = (key: keyof ConsentState) => getConsent()[key];

export const onConsentChange = (handler: (state: ConsentState) => void) => {
  const listener = () => handler(getConsent());
  window.addEventListener('cookie-consent-change', listener);
  return () => window.removeEventListener('cookie-consent-change', listener);
};
