'use client';

import { animate, motion, useInView } from 'framer-motion';
import { GraduationCap, BriefcaseBusiness } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { useI18n } from '@/lib/i18n';
import { useContact } from '@/components/ContactContext';
import { CvDownload } from '@/components/CvDownload';
import { MagneticButton } from '@/components/MagneticButton';
import { Reveal, TextReveal, ease } from '@/components/Reveal';

type Item = { role: string; org: string; date: string; resp: string[]; highlight: string; current?: boolean };

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.5, ease: 'easeOut', onUpdate: (l) => setV(Math.round(l)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref}>
      {v}
      {v === to ? suffix : ''}
    </span>
  );
}

function Card({ item, kind }: { item: Item; kind: 'edu' | 'work' }) {
  const { t } = useI18n();
  const current = !!item.current;
  const tag = current ? t('journey.labels.current') : kind === 'edu' ? t('journey.labels.study') : t('journey.labels.work');
  const base = current
    ? 'border-terra bg-terra p-[clamp(26px,3.4vw,48px)] text-white'
    : kind === 'edu'
      ? 'border-terra/50 bg-card p-[clamp(20px,2.4vw,32px)]'
      : 'border-cream/20 bg-cream/5 p-[clamp(20px,2.4vw,32px)]';
  const muted = current ? 'text-white/85' : kind === 'work' ? 'text-cream/65' : 'text-mute';
  return (
    <motion.article
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.9, ease }}
      className={`relative rounded-[22px] border ${base}`}
    >
      <span
        aria-hidden
        className={`absolute -left-[34px] top-[30px] h-[18px] w-[18px] rounded-full border-2 ${
          current ? 'border-white bg-white' : `border-terra ${kind === 'edu' ? 'bg-sand' : 'bg-night'}`
        }`}
      />
      <div className={`flex flex-wrap items-center justify-between gap-3 text-sm font-medium ${current ? 'text-white/90' : 'text-terra'}`}>
        <span>{item.date}</span>
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
            current ? 'border-white bg-white text-terra' : kind === 'work' ? 'border-terra bg-terra text-white' : 'border-terra'
          }`}
        >
          {current && <span className="h-2 w-2 animate-pulse-soft rounded-full bg-terra" />}
          {tag}
        </span>
      </div>
      <h4 className={`mt-3 leading-[1.05] ${current ? 'text-[clamp(34px,4.2vw,64px)]' : 'text-[clamp(26px,2.6vw,38px)]'}`}>{item.role}</h4>
      <p className={`mt-1 ${muted}`}>{item.org}</p>
      <span className={`mt-4 block text-xs ${muted}`}>{t('journey.labels.resp')}</span>
      <ul className={current ? 'mt-2 flex flex-wrap gap-2' : `mt-1.5 list-disc pl-[18px] text-[15px] ${muted}`}>
        {item.resp.map((r) => (
          <li key={r} className={current ? 'rounded-full border border-white/55 px-4 py-1.5 list-none' : ''}>
            {r}
          </li>
        ))}
      </ul>
      <span className={`mt-4 block text-xs ${muted}`}>{t('journey.labels.highlight')}</span>
      <p className="mt-1 text-[15px]">{item.highlight}</p>
    </motion.article>
  );
}

function Block({ kind }: { kind: 'edu' | 'work' }) {
  const { t, get } = useI18n();
  const items = get<Item[]>(`journey.${kind}.items`);
  const tl = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const dark = kind === 'work';
  const stats = kind === 'edu' ? [{ n: 5, s: '' }, { n: 1, s: '' }] : [{ n: 3, s: '+' }, { n: 6, s: '' }];
  const Icon = kind === 'edu' ? GraduationCap : BriefcaseBusiness;

  useLayoutEffect(() => {
    if (!tl.current || !fill.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(fill.current, { scaleY: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(fill.current, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: tl.current, start: 'top 65%', end: 'bottom 65%', scrub: true } });
    }, tl);
    return () => ctx.revert();
  }, [items.length]);

  return (
    <div className={`py-[clamp(64px,10vh,120px)] ${dark ? 'bg-night text-cream' : 'bg-sand'}`}>
      <div className="wrap grid gap-[clamp(24px,5vw,80px)] lg:grid-cols-[minmax(220px,.75fr)_2fr]">
        <div className="self-start lg:sticky lg:top-28">
          <Icon size={52} strokeWidth={1.4} className="text-terra" aria-hidden />
          <h3 className="mb-2.5 mt-3.5 text-[clamp(46px,6vw,96px)]">{t(`journey.${kind}.title`)}</h3>
          <p className={dark ? 'text-cream/65' : 'text-mute'}>{t(`journey.${kind}.sub`)}</p>
          <div className="mt-7 flex gap-7">
            {stats.map((s, i) => (
              <div key={i}>
                <b className="block font-serif text-[clamp(48px,5vw,76px)] font-normal leading-[.9] text-terra">
                  <Counter to={s.n} suffix={s.s} />
                </b>
                <span className={`mt-1.5 block max-w-[14ch] text-[13px] leading-tight ${dark ? 'text-cream/65' : 'text-mute'}`}>
                  {t(`journey.${kind}.stat${i + 1}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div ref={tl} className="relative grid gap-[clamp(14px,2vw,22px)] pl-[34px]">
          <div aria-hidden className={`absolute bottom-2 left-2 top-2 w-0.5 ${dark ? 'bg-cream/20' : 'bg-line'}`} />
          <div ref={fill} aria-hidden className="absolute bottom-2 left-2 top-2 w-0.5 origin-top scale-y-0 bg-terra" />
          {items.map((it) => (
            <Card key={it.role + it.date} item={it} kind={kind} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CareerJourney() {
  const { t } = useI18n();
  const { openContact } = useContact();
  return (
    <section id="journey" aria-labelledby="journey-title" className="mt-[clamp(80px,12vh,160px)]">
      <div className="wrap flex flex-wrap items-end justify-between gap-6 pb-[clamp(32px,5vw,64px)]">
        <div>
          <h2 id="journey-title" className="text-[clamp(52px,8vw,132px)]">
            <TextReveal text={t('journey.title')} />
          </h2>
          <Reveal>
            <p className="mt-3 text-mute">{t('journey.sub')}</p>
          </Reveal>
        </div>
        <CvDownload />
      </div>
      <Block kind="edu" />
      <Block kind="work" />
      <div className="wrap pt-[clamp(70px,10vh,120px)] text-center">
        <h3 className="text-[clamp(40px,5vw,80px)]">{t('journey.cv.more')}</h3>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
          <CvDownload showNote={false} align="center" />
          <MagneticButton onClick={(e) => openContact(e.currentTarget)} className="btn-dark">
            {t('cta.button')}
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
