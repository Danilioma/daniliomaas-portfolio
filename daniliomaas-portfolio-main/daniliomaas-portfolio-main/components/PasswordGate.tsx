'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { gsap } from '@/lib/gsap';
import { sha256 } from '@/lib/sha256';
import { site } from '@/lib/site';
import { useI18n } from '@/lib/i18n';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { MagneticButton } from '@/components/MagneticButton';

type Status = 'checking' | 'locked' | 'open';
type AuthCtx = { status: Status; ready: boolean; unlock: () => void };
const AuthContext = createContext<AuthCtx>({ status: 'checking', ready: false, unlock: () => {} });
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('checking');

  useEffect(() => {
    let ok = false;
    try {
      ok = localStorage.getItem(site.storageKeys.auth) === site.accessHash;
    } catch {}
    setStatus(ok ? 'open' : 'locked');
  }, []);

  const unlock = useCallback(() => {
    try {
      localStorage.setItem(site.storageKeys.auth, site.accessHash);
    } catch {}
    setStatus('open');
  }, []);

  return <AuthContext.Provider value={{ status, ready: status === 'open', unlock }}>{children}</AuthContext.Provider>;
}

const grain =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function Gate() {
  const { t } = useI18n();
  const { unlock } = useAuth();
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(0);
  const [busy, setBusy] = useState(false);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.15 })
        .from('.g-bg', { opacity: 0, scale: 1.25, duration: 2.4, ease: 'power3.out' }, 0)
        .from('.g-k', { opacity: 0, y: 20, duration: 1 }, 0.6)
        .from('.g-h > span > span', { yPercent: 110, duration: 1.5, ease: 'power4.out' }, 0.8)
        .from('.g-p', { opacity: 0, y: 20, duration: 1.2 }, 1.3)
        .from('.g-f', { opacity: 0, y: 20, duration: 1.2, stagger: 0.15 }, 1.5);
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => input.current?.focus({ preventScroll: true }), 900);
    return () => clearTimeout(id);
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const hash = await sha256(input.current?.value.trim() ?? '');
      if (hash === site.accessHash) {
        setError('');
        unlock();
      } else {
        setError(t('gate.error'));
        setShake((n) => n + 1);
        if (input.current) input.current.value = '';
      }
    } catch {
      setError(t('gate.nosubtle'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      ref={root}
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      className="fixed inset-0 z-[300] grid place-items-center overflow-hidden bg-black text-cream"
      initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 1.3, ease: [0.77, 0, 0.18, 1] } }}
    >
      <div className="g-bg absolute inset-0">
        <div className="absolute -inset-[5%]">
          <Image src="/images/portrait.jpg" alt="" fill priority sizes="100vw" className="animate-kenburns object-cover object-[50%_18%] brightness-[.4] contrast-[1.15] grayscale" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,.1)_20%,#000_95%)]" />
      </div>
      <div aria-hidden className="pointer-events-none absolute -inset-1/2 animate-grain opacity-[.13]" style={{ backgroundImage: grain }} />
      <div className="absolute right-[clamp(20px,4vw,48px)] top-[calc(20px+env(safe-area-inset-top,0px))] z-10">
        <LanguageSwitcher variant="dark" />
      </div>

      <div className="relative w-[min(700px,100%)] p-6 text-center">
        <p className="g-k font-serif text-[clamp(20px,2vw,26px)] italic text-terra-light">Danilio Maas</p>
        <h1 id="gate-title" className="g-h mt-2 text-[clamp(60px,17vw,230px)] leading-[.9]">
          <span className="block overflow-hidden pb-[0.1em]">
            <span className="block">{t('gate.welcome')}</span>
          </span>
        </h1>
        <p className="g-p mx-auto mt-3 max-w-[34ch] text-[clamp(16px,1.5vw,19px)] text-cream/70">{t('gate.tagline')}</p>

        <form onSubmit={submit} autoComplete="off" className="mt-[clamp(28px,5vh,52px)] grid justify-items-center gap-6">
          <label htmlFor="gate-pw" className="sr-only">
            {t('gate.label')}
          </label>
          <input
            key={shake}
            ref={input}
            id="gate-pw"
            type="password"
            required
            autoComplete="current-password"
            placeholder={t('gate.label')}
            aria-invalid={!!error}
            aria-describedby="gate-error"
            className={`g-f w-[min(380px,100%)] border-0 border-b border-cream/40 bg-transparent py-3.5 text-center text-[22px] font-light tracking-[.3em] text-cream outline-none transition-colors placeholder:tracking-normal placeholder:text-cream/40 focus:border-terra-light ${
              shake ? 'animate-shake' : ''
            }`}
          />
          <MagneticButton
            type="submit"
            disabled={busy}
            className="g-f inline-flex items-center gap-3.5 rounded-full bg-terra-light px-8 py-[18px] text-[17px] font-medium text-night transition-colors hover:bg-cream"
          >
            <span>{t('gate.enter')}</span>
            <ArrowRight size={20} aria-hidden />
          </MagneticButton>
        </form>
        <p id="gate-error" role="alert" className="mt-3 min-h-[1.6em] text-[15px] text-terra-light">
          {error}
        </p>
        <p className="g-f mt-1.5 text-sm text-cream/60">
          {t('gate.need')}{' '}
          <a className="text-cream underline underline-offset-4" href={`mailto:${site.email}?subject=${encodeURIComponent(t('gate.subject'))}`}>
            {t('gate.request')}
          </a>
        </p>
      </div>
    </motion.div>
  );
}

export function PasswordGate() {
  const { status } = useAuth();
  useLockBodyScroll(status !== 'open');
  return (
    <AnimatePresence>
      {status === 'checking' && <div key="check" aria-hidden className="fixed inset-0 z-[300] bg-black" />}
      {status === 'locked' && <Gate key="gate" />}
    </AnimatePresence>
  );
}
