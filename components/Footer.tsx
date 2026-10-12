'use client';

import { useI18n } from '@/lib/i18n';
import { site } from '@/lib/site';

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="wrap">
      <div className="mt-[clamp(80px,12vw,160px)] flex flex-wrap justify-between gap-4 border-t border-line pb-7 pt-6 text-sm text-mute">
        <span>
          © {new Date().getFullYear()} Danilio Maas. {t('footer.rights')}
        </span>
        <span>{t('footer.role')}</span>
        <a href={`mailto:${site.email}`} className="hover:text-ink">
          {site.email}
        </a>
      </div>
    </footer>
  );
}
