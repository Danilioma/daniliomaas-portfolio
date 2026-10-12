'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

export type Origin = { x: number; y: number };

type Ctx = {
  open: boolean;
  origin: Origin;
  openContact: (el?: Element | null) => void;
  closeContact: () => void;
};

const ContactCtx = createContext<Ctx | null>(null);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState<Origin>({ x: 0, y: 0 });
  useLockBodyScroll(open);

  const openContact = useCallback((el?: Element | null) => {
    if (el) {
      const r = el.getBoundingClientRect();
      setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    } else {
      setOrigin({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
    setOpen(true);
  }, []);
  const closeContact = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open, origin, openContact, closeContact }), [open, origin, openContact, closeContact]);
  return <ContactCtx.Provider value={value}>{children}</ContactCtx.Provider>;
}

export function useContact() {
  const ctx = useContext(ContactCtx);
  if (!ctx) throw new Error('useContact must be used inside <ContactProvider>');
  return ctx;
}
