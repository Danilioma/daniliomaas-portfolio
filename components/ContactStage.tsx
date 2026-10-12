'use client';

import Image from 'next/image';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { useId, type ReactNode } from 'react';
import { useI18n } from '@/lib/i18n';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import { ease } from '@/components/Reveal';

function Layer({ depth, i, className, delay = 0, x, y, children }: { depth: number; i: number; className: string; delay?: number; x: MotionValue<number>; y: MotionValue<number>; children: ReactNode }) {
  const tx = useTransform(x, (v) => v * depth);
  const ty = useTransform(y, (v) => v * depth);
  return (
    <motion.div
      style={{ x: tx, y: ty }}
      initial={{ opacity: 0, scale: 0.88, filter: 'blur(16px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.3, delay: 0.7 + i * 0.14, ease }}
      className={`absolute ${className}`}
    >
      <div className="h-full w-full animate-float" style={{ animationDelay: `${delay}s` }}>
        {children}
      </div>
    </motion.div>
  );
}

const glass = 'rounded-2xl border border-cream/20 bg-cream/10 p-4 text-sm text-cream/65 backdrop-blur-md';
const glassTitle = 'mb-1 block font-serif text-[22px] font-normal leading-tight text-cream';

/** Animated, layered visual system for the contact experience. Every layer shows different content. */
export function ContactStage() {
  const { t } = useI18n();
  const { x, y } = useMouseParallax();
  const ring = `ring-${useId().replace(/:/g, '')}`;
  return (
    <div aria-hidden className="relative order-first h-[62vw] min-h-[300px] lg:sticky lg:top-28 lg:order-none lg:h-[min(80svh,800px)]">
      {/* 1. Portrait */}
      <Layer x={x} y={y} depth={18} i={0} delay={0} className="left-[16%] top-[2%] aspect-[4/5] w-[56%]">
        <div className="relative h-full w-full overflow-hidden rounded-b-2xl rounded-t-full shadow-deep">
          <Image src="/images/portrait.jpg" alt="" fill sizes="(max-width: 1024px) 60vw, 28vw" className="animate-kenburns object-cover object-[center_18%]" />
        </div>
      </Layer>

      {/* 2. Current internship */}
      <Layer x={x} y={y} depth={-30} i={1} delay={-3} className="right-0 top-[32%] aspect-[4/5] w-[48%]">
        <div className="flex h-full flex-col justify-between rounded-[18px] bg-terra-light p-5 text-night shadow-deep">
          <span className="text-[13px] opacity-70">{t('contact.stage.tag')}</span>
          <div>
            <b className="block font-serif text-[clamp(28px,3vw,44px)] font-normal leading-none">{t('contact.stage.org')}</b>
            <p className="mt-2 text-[13px] opacity-80">{t('contact.stage.role')}</p>
          </div>
          <div className="flex h-11 items-end gap-1.5">
            {[30, 55, 40, 80, 100].map((h, k) => (
              <i key={k} className="flex-1 origin-bottom animate-bar rounded-[3px] bg-night" style={{ height: `${h}%`, animationDelay: `${-k * 0.45}s` }} />
            ))}
          </div>
        </div>
      </Layer>

      {/* 3. Future marketer */}
      <Layer x={x} y={y} depth={28} i={4} delay={-7} className="left-0 top-[44%] aspect-square w-[150px]">
        <div className="relative grid h-full w-full place-content-center rounded-full bg-cream/10 text-center backdrop-blur-md">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(244,239,231,.2)" strokeWidth="3" />
            <motion.circle cx="50" cy="50" r="45" fill="none" stroke="#E8825A" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 1, ease }} />
          </svg>
          <span className="mx-auto max-w-[104px] font-serif text-[23px] leading-[1.05]">{t('contact.stage.future')}</span>
          <small className="mx-auto mt-1 max-w-[96px] text-[11px] text-cream/65">{t('contact.stage.creative')}</small>
        </div>
      </Layer>

      {/* 4. Ambition */}
      <Layer x={x} y={y} depth={40} i={2} delay={-5} className="bottom-[6%] left-[2%] w-[46%]">
        <div className={glass}>
          <b className={glassTitle}>{t('contact.stage.nextTitle')}</b>
          {t('contact.stage.nextText')}
        </div>
      </Layer>

      {/* 5. Focus areas */}
      <Layer x={x} y={y} depth={-44} i={3} delay={-2} className="bottom-0 right-[4%] w-[44%]">
        <div className={glass}>
          <b className={glassTitle}>{t('contact.stage.focusTitle')}</b>
          {t('contact.stage.focusText')}
        </div>
      </Layer>

      {/* 6. Rotating badge */}
      <Layer x={x} y={y} depth={-20} i={5} delay={0} className="right-[8%] top-0 aspect-square w-[120px]">
        <svg viewBox="0 0 120 120" className="animate-spin-slow h-full w-full">
          <defs>
            <path id={ring} d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" />
          </defs>
          <text fill="#F4EFE7" fontSize="10.5" letterSpacing="1.2">
            <textPath href={`#${ring}`} textLength="284" lengthAdjust="spacing">
              {t('contact.stage.badge')}
            </textPath>
          </text>
        </svg>
      </Layer>
    </div>
  );
}
