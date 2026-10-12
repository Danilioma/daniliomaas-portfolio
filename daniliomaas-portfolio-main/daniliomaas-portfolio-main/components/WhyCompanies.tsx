'use client';

import Image from 'next/image';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import { TextReveal, ease } from '@/components/Reveal';

type Strength = { title: string; line: string; proof: string };

/** Desktop positions: cards sit in two columns left and right of the portrait. */
const positions = [
  'lg:left-0 lg:top-0',
  'lg:right-0 lg:top-[8%]',
  'lg:left-0 lg:top-[25%]',
  'lg:right-0 lg:top-[33%]',
  'lg:left-0 lg:top-[50%]',
  'lg:right-0 lg:top-[58%]',
  'lg:left-0 lg:top-[75%]',
  'lg:right-0 lg:top-[83%]',
];

function StrengthCard({ item, index, x, y }: { item: Strength; index: number; x: MotionValue<number>; y: MotionValue<number> }) {
  // Very soft parallax (max ~4px) layered on top of a ±5px CSS float.
  const depth = (index % 2 ? -1 : 1) * (6 + (index % 3) * 2);
  const tx = useTransform(x, (v) => v * depth);
  const ty = useTransform(y, (v) => v * depth);
  return (
    <motion.div style={{ x: tx, y: ty }} className={`group relative z-0 focus-within:z-20 hover:z-20 lg:absolute lg:w-[28%] ${positions[index]}`}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-8% 0px' }}
        transition={{ duration: 0.9, ease, delay: (index % 4) * 0.08 }}
      >
        <div className="animate-float-soft" style={{ animationDelay: `${-index * 1.3}s` }}>
          <article
            tabIndex={0}
            className="rounded-2xl border border-line bg-card/80 p-5 shadow-soft backdrop-blur-md transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-terra/40 hover:shadow-[0_32px_64px_-28px_rgba(180,80,45,.4)] focus-visible:-translate-y-1 focus-visible:border-terra/40"
          >
            <h3 className="font-serif text-[clamp(22px,2vw,28px)] leading-none">{item.title}</h3>
            <p className="mt-2 text-sm leading-snug text-mute">{item.line}</p>
            {/* Proof: always visible on small screens, revealed on hover / focus on desktop */}
            <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-premium lg:grid-rows-[0fr] lg:group-focus-within:grid-rows-[1fr] lg:group-hover:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <p className="mt-3 border-t border-line pt-3 text-[13px] leading-snug text-terra">{item.proof}</p>
              </div>
            </div>
          </article>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function WhyCompanies() {
  const { t, get } = useI18n();
  const items = get<Strength[]>('why.items');
  const { x, y } = useMouseParallax();

  return (
    <section
      id="why"
      aria-labelledby="why-title"
      className="wrap grid items-center gap-[clamp(32px,5vw,80px)] py-[clamp(60px,10vh,120px)] lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)]"
    >
      <div>
        <h2 id="why-title" className="text-[clamp(40px,5vw,84px)]">
          <TextReveal text={t('why.title')} />
        </h2>
        <span className="hint">{t('why.hint')}</span>
        <p className="mt-[clamp(20px,3vw,36px)] max-w-[30ch] font-serif text-[clamp(24px,2.4vw,36px)] leading-[1.2]">{t('why.summary')}</p>
      </div>

      {/* Floating strengths: stacked grid on mobile, composition around the portrait on desktop */}
      <div className="relative mx-auto grid w-full max-w-[640px] grid-cols-1 gap-4 min-[520px]:grid-cols-2 lg:block lg:h-[min(92svh,820px)] lg:max-w-none">
        {/* subtle static circular decoration (desktop only) */}
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-[45%] hidden aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-line lg:block" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-[45%] hidden aspect-square w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-line lg:block" />

        <div className="relative z-0 order-first mx-auto mb-2 aspect-[4/5] w-[62%] max-w-[300px] min-[520px]:col-span-2 lg:absolute lg:left-1/2 lg:top-[26%] lg:mb-0 lg:w-[38%] lg:max-w-none lg:-translate-x-1/2">
          <div className="h-full w-full animate-float-soft">
            <div className="relative h-full w-full overflow-hidden rounded-[22px] shadow-deep">
              <Image src="/images/portrait.jpg" alt="Danilio Maas" fill sizes="(max-width: 1024px) 60vw, 25vw" className="object-cover object-[center_18%]" />
            </div>
          </div>
        </div>

        {items.map((it, i) => (
          <StrengthCard key={i} item={it} index={i} x={x} y={y} />
        ))}
      </div>
    </section>
  );
}
