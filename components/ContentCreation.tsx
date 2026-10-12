'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Reveal, TextReveal, ease } from '@/components/Reveal';

type Row = { title: string; text: string };

export function ContentCreation() {
  const { t, get } = useI18n();
  const rows = get<Row[]>('craft.rows');
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="craft" aria-labelledby="craft-title" className="wrap pt-[clamp(60px,10vh,120px)] pb-[clamp(60px,10vh,120px)]">
      <div className="mb-[clamp(32px,5vw,64px)] flex items-end justify-between gap-6">
        <h2 id="craft-title" className="text-[clamp(44px,7vw,120px)]">
          <TextReveal text={t('craft.title')} />
        </h2>
        <span className="max-w-[26ch] text-sm text-mute">{t('craft.hint')}</span>
      </div>
      <Reveal className="border-t border-line">
        {rows.map((r, i) => {
          const isOpen = open === i;
          return (
            <div key={r.title} className="group border-b border-line">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`craft-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between py-[clamp(18px,2.4vw,34px)] text-left"
              >
                <motion.span
                  animate={{ x: isOpen ? 18 : 0 }}
                  whileHover={{ x: 18 }}
                  transition={{ duration: 0.5, ease }}
                  className={`font-serif text-[clamp(34px,5vw,80px)] leading-[.95] transition-colors ${isOpen ? 'text-terra' : 'group-hover:text-terra'}`}
                >
                  {r.title}
                </motion.span>
                <span className={`grid h-9 w-9 flex-none place-items-center rounded-full border transition-colors duration-300 ${isOpen ? 'border-terra bg-terra text-white' : 'border-line'}`}>
                  <Plus size={16} className={`transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`} aria-hidden />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`craft-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-[56ch] pb-7 pl-[18px] text-mute">{r.text}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}
