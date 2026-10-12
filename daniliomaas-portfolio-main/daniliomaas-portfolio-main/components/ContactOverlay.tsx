'use client';

import { useContact } from '@/components/ContactContext';
import { ContactScene } from '@/components/ContactScene';

/** Fullscreen overlay opened by "Start a conversation". */
export function ContactOverlay() {
  const { open, origin, closeContact } = useContact();
  if (!open) return null;
  return <ContactScene mode="overlay" origin={origin} onClosed={closeContact} />;
}
