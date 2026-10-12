'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Instagram, Linkedin } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useI18n } from '@/lib/i18n';
import { site } from '@/lib/site';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { MagneticButton } from '@/components/MagneticButton';
import { ContactStage } from '@/components/ContactStage';
import { ease } from '@/components/Reveal';
import type { Origin } from '@/components/ContactContext';

type Topic = { value: string; label: string };

const wipe: [number, number, number, number] = [0.77, 0, 0.18, 1];
const closedAt = (o: Origin) => `circle(0% at ${o.x}px ${o.y}px)`;
const openAt = (o: Origin) => `circle(150% at ${o.x}px ${o.y}px)`;

function Rise({ i, className, children }: { i: number; className?: string; children: ReactNode }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 46, filter: 'blur(12px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 1, ease, delay: 0.55 + i * 0.07 }}
    >
      {children}
    </motion.div>
  );
}

const field = 'w-full rounded-none border-0 border-b border-cream/20 bg-transparent py-2.5 text-lg text-cream outline-none transition-colors focus:border-terra-light';

/** Fullscreen contact experience. Used as an overlay and as the dedicated /contact page. */
export function ContactScene({ origin, onClosed, mode }: { origin: Origin; onClosed: () => void; mode: 'overlay' | 'page' }) {
  const { t, get } = useI18n();
  const topics = get<Topic[]>('contact.topics');
  const [leaving, setLeaving] = useState(false);
  const [exitOrigin, setExitOrigin] = useState(origin);
  const [note, setNote] = useState('');
  const root = useRef<HTMLElement>(null);

  const leave = (el?: Element | null) => {
    const target = el ?? document.getElementById('contact-back');
    if (target) {
      const r = target.getBoundingClientRect();
      setExitOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
    setLeaving(true);
  };

  useEffect(() => {
    const id = setTimeout(() => document.getElementById('contact-back')?.focus({ preventScroll: true }), 800);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') leave(null);
      if (e.key === 'Tab' && root.current) {
        const f = Array.from(root.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,textarea')).filter((el) => el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(id);
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = `${t('contact.greeting')}\n\n${f.get('message')}\n\n${t('contact.regards')}\n${f.get('name')}${f.get('org') ? `\n${f.get('org')}` : ''}\n${f.get('email')}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`${f.get('topic')} | ${f.get('name')}`)}&body=${encodeURIComponent(body)}`;
    setNote(t('contact.sent'));
  };

  return (
    <motion.section
      ref={root}
      data-lenis-prevent
      role={mode === 'overlay' ? 'dialog' : 'region'}
      aria-modal={mode === 'overlay' ? true : undefined}
      aria-labelledby="contact-title"
      initial={{ clipPath: closedAt(origin) }}
      animate={{ clipPath: leaving ? closedAt(exitOrigin) : openAt(origin) }}
      transition={{ duration: 1.2, ease: wipe }}
      onAnimationComplete={() => leaving && onClosed()}
      className="fixed inset-0 z-[200] overflow-y-auto overscroll-contain bg-night text-cream"
    >
      <motion.header
        initial={{ opacity: 0, y: '-100%' }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease }}
        className="sticky top-0 z-10 flex min-h-24 items-center justify-between gap-4 border-b border-cream/20 bg-night/85 px-gutter pb-3.5 pt-[calc(14px+env(safe-area-inset-top,0px))] backdrop-blur-xl"
      >
        <div className="flex items-center gap-3.5">
          <span aria-hidden className="grid h-[52px] w-[52px] place-items-center rounded-full bg-terra-light font-serif text-[22px] text-night">
            DM
          </span>
          <div>
            <b className="block font-serif text-[clamp(24px,2.4vw,32px)] font-normal leading-none">Danilio Maas</b>
            <small className="mt-0.5 hidden text-sm text-cream/65 sm:block">{t('nav.contact')}</small>
          </div>
        </div>
        <div className="flex items-center gap-[clamp(10px,2vw,20px)]">
          <LanguageSwitcher variant="dark" />
          <MagneticButton
            id="contact-back"
            onClick={(e) => leave(e.currentTarget)}
            aria-label={t('a11y.back')}
            className="group inline-flex min-h-[60px] items-center gap-4 rounded-full bg-cream py-0 pl-2.5 pr-7 text-[17px] font-medium text-night transition-colors hover:bg-terra-light"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-night text-cream transition-transform duration-500 ease-premium group-hover:-translate-x-1"
            >
              <ArrowLeft size={18} aria-hidden />
            </span>
            <span>{t('a11y.back')}</span>
          </MagneticButton>
        </div>
      </motion.header>

      <div className="mx-auto grid max-w-wide items-start gap-[clamp(24px,5vw,80px)] px-gutter pb-16 pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,.9fr)]">
        <div>
          <Rise i={1}>
            <h2 id="contact-title" className="text-[clamp(52px,8vw,132px)] leading-[.9]">
              {t('contact.t1')} <i className="text-terra-light">{t('contact.t2')}</i>
            </h2>
          </Rise>
          <Rise i={2}>
            <p className="mt-6 max-w-[46ch] text-[clamp(17px,1.5vw,21px)] text-cream/65">{t('contact.intro')}</p>
          </Rise>
          <Rise i={3}>
            <a href={`mailto:${site.email}`} className="mt-7 block rounded-[18px] border border-cream/20 px-6 py-5 transition-colors hover:border-terra-light hover:bg-terra-light/10">
              <small className="block text-sm text-cream/65">{t('contact.primary')}</small>
              <strong className="mt-1 block break-all font-serif text-[clamp(24px,3.2vw,44px)] font-normal leading-[1.1]">{site.email}</strong>
            </a>
          </Rise>
          <Rise i={4} className="mt-4 flex flex-wrap gap-3">
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="flex flex-1 basis-[200px] items-center justify-between rounded-full bg-cream px-6 py-[18px] font-medium text-night transition hover:scale-[1.03] hover:bg-white">
              Instagram @danilio.ma <Instagram size={22} aria-hidden />
            </a>
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="flex flex-1 basis-[200px] items-center justify-between rounded-full bg-terra-light px-6 py-[18px] font-medium text-night transition hover:scale-[1.03] hover:bg-white">
              LinkedIn <Linkedin size={22} aria-hidden />
            </a>
          </Rise>
          <Rise i={5} className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="border-t border-cream/20 pt-3 text-[15px] text-cream/65">
              <b className="mb-0.5 block font-medium text-cream">
                <span className="mr-2 inline-block h-[9px] w-[9px] animate-pulse-soft rounded-full bg-[#6FD08C]" />
                {t('contact.availTitle')}
              </b>
              {t('contact.availText')}
            </div>
            <div className="border-t border-cream/20 pt-3 text-[15px] text-cream/65">
              <b className="mb-0.5 block font-medium text-cream">{t('contact.locTitle')}</b>
              {t('contact.locText')}
            </div>
          </Rise>

          <Rise i={6}>
            <form onSubmit={submit} className="mt-[clamp(32px,4vw,56px)] grid gap-3.5">
              <h3 className="text-[clamp(30px,3vw,44px)]">{t('contact.formTitle')}</h3>
              <div role="group" aria-label={t('contact.formTitle')} className="flex flex-wrap gap-2">
                {topics.map((tp, i) => (
                  <label key={tp.value} className="cursor-pointer">
                    <input type="radio" name="topic" value={tp.value} defaultChecked={i === 0} className="peer sr-only" />
                    <span className="inline-block rounded-full border border-cream/20 px-[18px] py-2 text-[15px] transition-colors peer-checked:border-terra-light peer-checked:bg-terra-light peer-checked:text-night peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terra-light">
                      {tp.label}
                    </span>
                  </label>
                ))}
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <label className="block text-sm text-cream/65">
                  {t('contact.name')}
                  <input name="name" required autoComplete="name" className={field} />
                </label>
                <label className="block text-sm text-cream/65">
                  {t('contact.org')}
                  <input name="org" autoComplete="organization" className={field} />
                </label>
              </div>
              <label className="block text-sm text-cream/65">
                {t('contact.email')}
                <input name="email" type="email" required autoComplete="email" className={field} />
              </label>
              <label className="block text-sm text-cream/65">
                {t('contact.message')}
                <textarea name="message" rows={4} required className={field} />
              </label>
              <MagneticButton type="submit" className="justify-self-start rounded-full bg-terra-light px-[42px] py-[22px] text-lg font-medium text-night transition-colors hover:bg-cream">
                {t('contact.send')}
              </MagneticButton>
              <p role="status" className="m-0 text-sm text-cream/65">
                {note || t('contact.note')}
              </p>
            </form>
          </Rise>
        </div>
        <ContactStage />
      </div>
    </motion.section>
  );
}
