'use client';

import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { useI18n } from '@/lib/i18n';
import { Reveal, TextReveal } from '@/components/Reveal';
import { ImageGallery } from '@/components/ImageGallery';

function Word({ word, i, n, progress }: { word: string; i: number; n: number; progress: MotionValue<number> }) {
  const start = i / n;
  const opacity = useTransform(progress, [start, Math.min(1, start + 1.2 / n)], [0.16, 1]);
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

function ScrollWords({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.4'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className="max-w-[20ch] font-serif text-[clamp(34px,5.6vw,92px)] leading-[1.05] tracking-[-0.015em]">
      {words.map((w, i) => (
        <Word key={`${i}-${w}`} word={w} i={i} n={words.length} progress={scrollYProgress} />
      ))}
    </p>
  );
}

export function About() {
  const { t, get } = useI18n();
  const paragraphs = get<string[]>('about.paragraphs');
  const skills = get<string[]>('about.skills');
  return (
    <>
      <section className="flex min-h-[100svh] items-center py-[clamp(120px,22vh,260px)]" aria-label="Manifesto">
        <div className="wrap">
          <ScrollWords text={t('about.manifesto')} />
        </div>
      </section>

      <section id="story" className="wrap grid items-center gap-[clamp(32px,7vw,120px)] py-[clamp(80px,14vh,160px)] lg:grid-cols-[5fr_7fr]">
        <ImageGallery
          className="aspect-[4/5] w-full"
          images={[
            { src: '/images/portrait.jpg', alt: t('about.photoAlt'), className: 'inset-0', speed: 7, position: 'object-[center_20%]' },
            { src: '/images/street.jpg', alt: '', className: '-bottom-6 -right-4 hidden aspect-[4/3] w-[52%] border-4 border-cream md:block', speed: 12 },
          ]}
        />
        <div>
          <h2 className="text-[clamp(40px,5.2vw,84px)]">
            <TextReveal text={t('about.title')} />
          </h2>
          {paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.05 * i} className="mt-6 max-w-[46ch] text-[clamp(17px,1.4vw,21px)] text-mute">
              <p>{p}</p>
            </Reveal>
          ))}
          <Reveal className="mt-7 flex flex-wrap gap-2.5">
            {skills.map((s) => (
              <span key={s} className="pill">
                {s}
              </span>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
