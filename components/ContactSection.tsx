'use client';

import Link from 'next/link';
import { Instagram, Linkedin } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { site } from '@/lib/site';
import { useContact } from '@/components/ContactContext';
import { MagneticButton } from '@/components/MagneticButton';
import { Reveal, TextReveal } from '@/components/Reveal';

export function ContactSection() {
  const { t } = useI18n();
  const { openContact } = useContact();
  return (
    <section id="contact" aria-labelledby="cta-title" className="wrap pb-6 pt-[clamp(100px,18vh,220px)] text-center">
      <h2 id="cta-title" className="text-[clamp(56px,12vw,200px)] leading-[.88]">
        <TextReveal text={t('cta.t1')} />
        <span className="italic text-terra">
          <TextReveal text={t('cta.t2')} delay={0.15} />
        </span>
        <TextReveal text={t('cta.t3')} delay={0.3} />
      </h2>
      <Reveal className="mx-auto mt-6 max-w-[40ch] text-mute">
        <p>{t('cta.sub')}</p>
      </Reveal>
      <Reveal className="mt-[clamp(36px,5vw,64px)]">
        <MagneticButton onClick={(e) => openContact(e.currentTarget)} className="btn-dark">
          {t('cta.button')}
        </MagneticButton>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="rounded-full border border-line px-6 py-3 transition-colors hover:bg-ink hover:text-cream">
            {t('cta.page')}
          </Link>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 transition-colors hover:bg-ink hover:text-cream">
            <Linkedin size={18} aria-hidden /> LinkedIn
          </a>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 transition-colors hover:bg-ink hover:text-cream">
            <Instagram size={18} aria-hidden /> Instagram
          </a>
        </div>
      </Reveal>
    </section>
  );
}
