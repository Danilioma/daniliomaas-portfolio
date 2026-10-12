'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useInView } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { TextReveal, ease } from '@/components/Reveal';

type Strength = { title: string; line: string; proof: string };

export function WhyCompanies() {
  const { t, get } = useI18n();
  const items = get<Strength[]>('why.items');
  const [cur, setCur] = useState(0);
  const [hold, setHold] = useState(false);
  const orb = useRef<HTMLDivElement>(null);
  const seen = useInView(orb, { once: true, amount: 0.25 });
  const visible = useInView(orb, { amount: 0.25 });

  useEffect(() => {
    if (!visible || hold || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setTimeout(() => setCur((c) => (c + 1) % items.length), 3600);
    return () => clearTimeout(id);
  }, [cur, visible, hold, items.length]);

  const pick = (i: number) => {
    setCur(i);
    setHold(true);
  };
  const s = items[cur];

  return (
    <section id="why" aria-labelledby="why-title" className="wrap grid items-center gap-[clamp(24px,5vw,80px)] py-[clamp(60px,10vh,120px)] lg:grid-cols-[1fr_1.05fr]">
      <div>
        <h2 id="why-title" className="text-[clamp(40px,5vw,84px)]">
          <TextReveal text={t('why.title')} />
        </h2>
        <span className="hint">{t('why.hint')}</span>

        <div className="mt-[clamp(24px,4vw,48px)] min-h-[260px]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
              transition={{ duration: 0.5, ease }}
            >
              <h3 className="text-[clamp(48px,6vw,100px)] text-terra">{s.title}</h3>
              <p className="mt-3.5 max-w-[30ch] text-[clamp(18px,1.7vw,24px)] leading-[1.35]">{s.line}</p>
              <p className="mt-[18px] max-w-[44ch] border-t border-line pt-3.5 text-[15px] text-mute">
                <b className="mr-2.5 font-medium text-ink">{t('why.proof')}</b>
                {s.proof}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-5 flex gap-2">
          {items.map((it, i) => (
            <button key={it.title} type="button" aria-label={it.title} onClick={() => pick(i)} className="relative h-1.5 w-[34px] overflow-hidden rounded-full bg-line">
              {cur === i && (
                <motion.span
                  key={`${cur}-${hold}`}
                  className="absolute inset-0 origin-left bg-terra"
                  initial={{ scaleX: hold ? 1 : 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: hold ? 0 : 3.6, ease: 'linear' }}
                />
              )}
            </button>
          ))}
        </div>
        <span className="hint">{t('why.tap')}</span>
      </div>

      <div ref={orb} className={`orb ${seen ? 'is-in' : ''} ${hold ? 'is-held' : ''}`} onMouseLeave={() => setHold(false)}>
        <div aria-hidden className="orb-dash animate-spin-rev" style={{ width: 'calc(var(--R) * 2)', aspectRatio: '1' }} />
        <div aria-hidden className="orb-dash" style={{ width: 'calc(var(--R) * 1.2)', aspectRatio: '1' }} />
        <div className="orb-ring">
          {items.map((it, i) => (
            <div key={it.title} className="orb-nd" style={{ '--a': `${i * 45}deg`, '--i': i } as CSSProperties}>
              <button
                type="button"
                className="orb-btn"
                aria-pressed={cur === i}
                onMouseEnter={() => pick(i)}
                onFocus={() => setCur(i)}
                onClick={() => pick(i)}
              >
                {it.title}
              </button>
            </div>
          ))}
        </div>
        <div className="absolute left-1/2 top-1/2 aspect-square w-[30%] -translate-x-1/2 -translate-y-1/2">
          <div className="relative h-full w-full overflow-hidden rounded-full shadow-soft">
            <Image src="/images/portrait.jpg" alt="Danilio Maas" fill sizes="200px" className="object-cover object-[center_15%]" />
          </div>
          <span aria-hidden className="absolute -inset-2 animate-ping rounded-full border border-terra" />
        </div>
      </div>
    </section>
  );
}
