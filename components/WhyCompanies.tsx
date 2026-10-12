'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useAnimationFrame, useInView, useMotionValue, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { TextReveal, ease } from '@/components/Reveal';

type Strength = { title: string; line: string; proof: string };

/** One full revolution takes 90 seconds. */
const DEG_PER_MS = 360 / 90_000;

/**
 * A single keyword on the orbit.
 *
 * Both the arm rotation and the label counter-rotation are derived from the SAME
 * motion value (`angle`), so the label is always rotated by exactly -(arm angle).
 * Net orientation is therefore always 0deg: it can never drift, tilt or flip,
 * no matter when the node is mounted or how often the language changes.
 */
function OrbitNode({
  index,
  count,
  angle,
  label,
  active,
  onPick,
  onPreview,
}: {
  index: number;
  count: number;
  angle: MotionValue<number>;
  label: string;
  active: boolean;
  onPick: () => void;
  onPreview: () => void;
}) {
  const base = (index * 360) / count;
  const armRotate = useTransform(angle, (v) => v + base);
  const labelRotate = useTransform(angle, (v) => -(v + base));
  return (
    <motion.div className="orb-nd" style={{ rotate: armRotate }}>
      <div className="orb-arm" style={{ transitionDelay: `${index * 0.09}s` }}>
        <motion.button
          type="button"
          className="orb-btn"
          style={{ rotate: labelRotate, x: '-50%', y: '-50%' }}
          aria-pressed={active}
          onMouseEnter={onPick}
          onFocus={onPreview}
          onClick={onPick}
        >
          {label}
        </motion.button>
      </div>
    </motion.div>
  );
}

/**
 * The rotating keyword orbit. The parent renders it with `key={locale}`, so a
 * language change unmounts it and mounts a fresh instance: the angle motion value
 * starts again at 0 and no transform state is carried over.
 */
function Orbit({
  items,
  cur,
  hold,
  onPick,
  onPreview,
  onLeave,
}: {
  items: Strength[];
  cur: number;
  hold: boolean;
  onPick: (i: number) => void;
  onPreview: (i: number) => void;
  onLeave: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.25 });
  const angle = useMotionValue(0);
  const [hovered, setHovered] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Single source of truth for the rotation. Pausing simply stops advancing the angle.
  useAnimationFrame((_, delta) => {
    if (reduced || hovered || hold) return;
    angle.set((angle.get() + Math.min(delta, 64) * DEG_PER_MS) % 360);
  });

  return (
    <div
      ref={ref}
      className={`orb ${seen ? 'is-in' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        onLeave();
      }}
    >
      <div aria-hidden className="orb-dash animate-spin-rev" style={{ width: 'calc(var(--R) * 2)', aspectRatio: '1' }} />
      <div aria-hidden className="orb-dash" style={{ width: 'calc(var(--R) * 1.2)', aspectRatio: '1' }} />
      {items.map((it, i) => (
        <OrbitNode
          key={i}
          index={i}
          count={items.length}
          angle={angle}
          label={it.title}
          active={cur === i}
          onPick={() => onPick(i)}
          onPreview={() => onPreview(i)}
        />
      ))}
      <div className="absolute left-1/2 top-1/2 aspect-square w-[30%] -translate-x-1/2 -translate-y-1/2">
        <div className="relative h-full w-full overflow-hidden rounded-full shadow-soft">
          <Image src="/images/portrait.jpg" alt="Danilio Maas" fill sizes="200px" className="object-cover object-[center_15%]" />
        </div>
        <span aria-hidden className="absolute -inset-2 animate-ping rounded-full border border-terra" />
      </div>
    </div>
  );
}

export function WhyCompanies() {
  const { t, get, locale } = useI18n();
  const items = get<Strength[]>('why.items');
  const [cur, setCur] = useState(0);
  const [hold, setHold] = useState(false);
  const section = useRef<HTMLElement>(null);
  const visible = useInView(section, { amount: 0.2 });

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
    <section
      ref={section}
      id="why"
      aria-labelledby="why-title"
      className="wrap grid items-center gap-[clamp(24px,5vw,80px)] py-[clamp(60px,10vh,120px)] lg:grid-cols-[1fr_1.05fr]"
    >
      <div>
        <h2 id="why-title" className="text-[clamp(40px,5vw,84px)]">
          <TextReveal text={t('why.title')} />
        </h2>
        <span className="hint">{t('why.hint')}</span>

        <div className="mt-[clamp(24px,4vw,48px)] min-h-[260px]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${locale}-${cur}`}
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
            <button key={i} type="button" aria-label={it.title} onClick={() => pick(i)} className="relative h-1.5 w-[34px] overflow-hidden rounded-full bg-line">
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

      {/* key={locale}: a language change remounts the orbit, so rotation restarts at 0deg */}
      <Orbit key={locale} items={items} cur={cur} hold={hold} onPick={pick} onPreview={setCur} onLeave={() => setHold(false)} />
    </section>
  );
}
