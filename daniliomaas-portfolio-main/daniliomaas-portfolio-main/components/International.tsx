'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { Reveal, TextReveal, ease } from '@/components/Reveal';

export function International() {
  const { t, get } = useI18n();
  const chips = get<string[]>('intl.chips');
  return (
    <section id="abroad" className="mt-[clamp(60px,10vh,120px)] rounded-t-[28px] bg-night py-[clamp(80px,14vh,160px)] text-cream">
      <div className="wrap">
        <Reveal>
          <span className="text-[15px] text-cream/60">{t('intl.kicker')}</span>
        </Reveal>
        <h2 className="mt-[18px] text-[clamp(42px,11vw,190px)] leading-[.88]">
          <TextReveal text={t('intl.title1')} />
          <br />
          <span className="italic text-terra-light">
            <TextReveal text={t('intl.title2')} delay={0.2} />
          </span>
        </h2>
        <Reveal className="mt-[clamp(32px,5vw,64px)] max-w-[50ch] text-[clamp(20px,2vw,30px)] leading-[1.35]">
          <p>{t('intl.text')}</p>
        </Reveal>
        <div className="mt-[clamp(40px,6vw,80px)] flex flex-wrap gap-3">
          {chips.map((c, i) => (
            <motion.span
              key={c}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.06, backgroundColor: '#B4502D', borderColor: '#B4502D' }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease, delay: i * 0.08 }}
              className="rounded-full border border-cream/40 px-5 py-2.5 text-[15px]"
            >
              {c}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
