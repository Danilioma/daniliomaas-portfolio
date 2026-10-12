'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { locales } from '@/lib/site';

export function LanguageSwitcher({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const { locale, setLocale, t } = useI18n();
  const dark = variant === 'dark';
  return (
    <div
      role="group"
      aria-label={t('a11y.language')}
      className={`relative inline-flex rounded-full border p-[3px] ${dark ? 'border-cream/30' : 'border-line bg-card'}`}
    >
      <motion.span
        aria-hidden
        className={`absolute bottom-[3px] left-[3px] top-[3px] w-[calc(50%-3px)] rounded-full ${dark ? 'bg-cream' : 'bg-ink'}`}
        animate={{ x: locale === 'en' ? '0%' : '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      />
      {locales.map((l) => {
        const active = locale === l;
        return (
          <button
            key={l}
            type="button"
            aria-pressed={active}
            onClick={() => setLocale(l)}
            className={`relative z-10 min-w-[46px] rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
              active ? (dark ? 'text-night' : 'text-cream') : dark ? 'text-cream/75' : 'text-mute'
            }`}
          >
            {l.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
