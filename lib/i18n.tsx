'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import en from '@/locales/en.json';
import nl from '@/locales/nl.json';
import { site, type Locale } from '@/lib/site';

const dictionaries = { en, nl } as const;

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  /** Resolve a string key such as "hero.tagline". */
  t: (key: string) => string;
  /** Resolve any value (arrays/objects) such as "journey.edu.items". */
  get: <T = unknown>(key: string) => T;
};

const I18nContext = createContext<Ctx | null>(null);

function resolve(obj: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>((acc, part) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[part] : undefined), obj);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(site.storageKeys.lang);
    } catch {}
    const next: Locale = saved === 'nl' || saved === 'en' ? saved : navigator.language.toLowerCase().startsWith('nl') ? 'nl' : 'en';
    setLocaleState(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = dictionaries[locale].meta.title;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(site.storageKeys.lang, l);
    } catch {}
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      locale,
      setLocale,
      t: (key) => {
        const v = resolve(dictionaries[locale], key);
        return typeof v === 'string' ? v : key;
      },
      get: <T,>(key: string) => resolve(dictionaries[locale], key) as T,
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
