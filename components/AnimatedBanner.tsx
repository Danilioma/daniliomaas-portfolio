'use client';

import { useI18n } from '@/lib/i18n';

type Strength = { title: string };

function Row({ words, reverse }: { words: string[]; reverse?: boolean }) {
  const line = (
    <>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-flex items-center">
          <span>{w}</span>
          <b aria-hidden className={`mx-[.3em] font-normal not-italic ${reverse ? 'text-ink' : 'text-terra'}`}>
            ·
          </b>
        </span>
      ))}
    </>
  );
  return (
    <div className={`flex w-max whitespace-nowrap font-serif text-[clamp(70px,11vw,170px)] leading-[1.05] ${reverse ? 'animate-marquee-rev italic text-terra' : 'animate-marquee text-ink'}`}>
      <div className="flex">{line}</div>
      <div className="flex" aria-hidden>
        {line}
      </div>
    </div>
  );
}

/** Continuously moving banner. Solid, high-contrast text (ink on cream, terracotta on cream). */
export function AnimatedBanner() {
  const { get } = useI18n();
  const words = get<Strength[]>('why.items').map((s) => s.title);
  return (
    <div aria-hidden className="overflow-hidden py-[clamp(40px,8vh,100px)]">
      <Row words={words} />
      <Row words={[...words].reverse()} reverse />
    </div>
  );
}
