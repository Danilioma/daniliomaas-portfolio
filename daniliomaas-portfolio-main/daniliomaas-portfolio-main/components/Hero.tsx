'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/components/PasswordGate';
import { ease } from '@/components/Reveal';

export function Hero() {
  const { t } = useI18n();
  const { ready } = useAuth();
  const state = ready ? 'show' : 'hide';
  return (
    <header id="top" className="relative flex min-h-[100svh] flex-col justify-end pb-12 pt-28">
      <div className="wrap relative flex flex-col">
        <motion.div
          initial="hide"
          animate={state}
          variants={{ hide: { clipPath: 'inset(100% 0 0 0)' }, show: { clipPath: 'inset(0% 0 0 0)', transition: { duration: 1.5, delay: 0.3, ease } } }}
          className="relative mb-8 ml-auto h-[42svh] w-[70%] overflow-hidden rounded-md shadow-soft md:absolute md:bottom-48 md:right-gutter md:top-0 md:mb-0 md:h-auto md:w-auto md:max-w-[44vw] md:aspect-[4/5]"
        >
          <Image src="/images/portrait.jpg" alt={t('hero.alt')} fill priority sizes="(max-width: 768px) 70vw, 44vw" className="object-cover object-[center_20%]" />
        </motion.div>

        <h1 className="relative z-10 -ml-[0.04em] text-[clamp(72px,17vw,280px)] leading-[.82]">
          {['Danilio', 'Maas'].map((w, i) => (
            <span key={w} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className={`block ${i === 1 ? 'italic text-terra' : ''}`}
                initial={{ y: '105%' }}
                animate={{ y: ready ? 0 : '105%' }}
                transition={{ duration: 1.3, delay: i * 0.14, ease }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-[clamp(32px,6vw,72px)] grid gap-8 border-t border-line pt-6 md:grid-cols-[1.2fr_1fr]"
        >
          <p className="max-w-[34ch] text-[clamp(18px,1.7vw,24px)] leading-[1.4]">{t('hero.tagline')}</p>
          <div className="text-[15px] text-mute md:justify-self-end md:text-right">
            {t('hero.role')}
            <br />
            {t('hero.location')}
          </div>
        </motion.div>
      </div>
    </header>
  );
}
