'use client';

import { Download } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { site } from '@/lib/site';
import { MagneticLink } from '@/components/MagneticButton';

export function CvDownload({ showNote = true, align = 'right' }: { showNote?: boolean; align?: 'left' | 'right' | 'center' }) {
  const { t } = useI18n();
  const text = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  return (
    <div className={text}>
      <MagneticLink
        href={site.cv}
        download
        className="group relative inline-flex items-center gap-[18px] overflow-hidden rounded-full bg-ink py-2 pl-[30px] pr-2 text-[17px] font-medium text-cream isolate"
      >
        <span aria-hidden className="absolute inset-0 -z-10 translate-y-full bg-terra transition-transform duration-500 ease-premium group-hover:translate-y-0" />
        <span className="transition-colors group-hover:text-white">{t('journey.cv.button')}</span>
        <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-cream text-ink">
          <Download size={20} className="transition-transform duration-300 group-hover:translate-y-1" aria-hidden />
        </span>
      </MagneticLink>
      {showNote && <small className="mt-2 block text-[13px] text-mute">{t('journey.cv.note')}</small>}
    </div>
  );
}
