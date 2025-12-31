import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CookieConsent = {
  necessary: true;
  functional: boolean;
  performance: boolean;
  targeting: boolean;
  updatedAt: string;
  version: number;
};

type CookieConsentContextValue = {
  consent: CookieConsent | null;
  hasChoice: boolean;
  setAll: (enabled: boolean) => void;
  setConsent: (next: { functional: boolean; performance: boolean; targeting: boolean }) => void;
  reset: () => void;
};

const STORAGE_KEY = "cookie_consent_v1";
const CONSENT_COOKIE_NAME = "cookie_consent_v1";
const CONSENT_VERSION = 1;

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined);

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function setCookie(name: string, value: string, days = 180) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax`;
}

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consent, setConsentState] = useState<CookieConsent | null>(null);
  const [hasChoice, setHasChoice] = useState(false);

  useEffect(() => {
    const stored = safeJsonParse<CookieConsent>(localStorage.getItem(STORAGE_KEY));
    if (stored && stored.version === CONSENT_VERSION) {
      setConsentState(stored);
      setHasChoice(true);
      return;
    }
    setConsentState(null);
    setHasChoice(false);
  }, []);

  const persist = (next: CookieConsent) => {
    setConsentState(next);
    setHasChoice(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setCookie(CONSENT_COOKIE_NAME, JSON.stringify(next));
  };

  const setAll = (enabled: boolean) => {
    const next: CookieConsent = {
      necessary: true,
      functional: enabled,
      performance: enabled,
      targeting: enabled,
      updatedAt: new Date().toISOString(),
      version: CONSENT_VERSION
    };
    persist(next);
  };

  const setConsent = (nextPartial: { functional: boolean; performance: boolean; targeting: boolean }) => {
    const next: CookieConsent = {
      necessary: true,
      functional: nextPartial.functional,
      performance: nextPartial.performance,
      targeting: nextPartial.targeting,
      updatedAt: new Date().toISOString(),
      version: CONSENT_VERSION
    };
    persist(next);
  };

  const reset = () => {
    setConsentState(null);
    setHasChoice(false);
    localStorage.removeItem(STORAGE_KEY);
    deleteCookie(CONSENT_COOKIE_NAME);
  };

  const value = useMemo(() => ({ consent, hasChoice, setAll, setConsent, reset }), [consent, hasChoice]);

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
};

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error("useCookieConsent must be used within CookieConsentProvider");
  return ctx;
}
