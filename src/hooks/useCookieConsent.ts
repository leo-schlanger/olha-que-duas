import { useState, useEffect, useCallback } from 'react';

export type ConsentState = 'pending' | 'accepted' | 'rejected';

const CONSENT_KEY = 'cookie-consent';

function getStoredConsent(): ConsentState {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    if (value === 'accepted' || value === 'rejected') return value;
  } catch {}
  return 'pending';
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentState>(getStoredConsent);

  const accept = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setConsent('accepted');
  }, []);

  const reject = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    setConsent('rejected');
  }, []);

  return { consent, accept, reject };
}

/** Check consent without hook (for non-component code) */
export function hasConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'accepted';
  } catch {
    return false;
  }
}
