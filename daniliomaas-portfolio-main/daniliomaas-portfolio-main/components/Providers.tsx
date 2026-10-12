'use client';

import type { ReactNode } from 'react';
import { I18nProvider, useI18n } from '@/lib/i18n';
import { AuthProvider, PasswordGate } from '@/components/PasswordGate';
import { ContactProvider } from '@/components/ContactContext';
import { ContactOverlay } from '@/components/ContactOverlay';
import { SmoothScroll } from '@/components/SmoothScroll';
import { Cursor } from '@/components/Cursor';

function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[400] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-cream"
    >
      {t('a11y.skip')}
    </a>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <ContactProvider>
          <SmoothScroll>
            <SkipLink />
            {children}
          </SmoothScroll>
          <ContactOverlay />
          <Cursor />
          <PasswordGate />
        </ContactProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
