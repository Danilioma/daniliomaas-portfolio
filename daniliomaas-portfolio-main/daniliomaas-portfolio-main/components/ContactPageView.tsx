'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ContactScene } from '@/components/ContactScene';
import type { Origin } from '@/components/ContactContext';

/** The dedicated /contact page: same scene as the overlay, opening from the screen centre. */
export function ContactPageView() {
  const router = useRouter();
  const [origin, setOrigin] = useState<Origin | null>(null);
  useEffect(() => {
    setOrigin({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  }, []);
  if (!origin) return <div className="min-h-[100svh] bg-night" aria-hidden />;
  return <ContactScene mode="page" origin={origin} onClosed={() => router.push('/')} />;
}
