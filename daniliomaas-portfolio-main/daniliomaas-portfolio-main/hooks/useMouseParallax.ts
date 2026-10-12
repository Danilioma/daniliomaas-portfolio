'use client';

import { useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

/** Normalised pointer position in the range -0.5..0.5, smoothed with a spring. */
export function useMouseParallax() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 60, damping: 20 });
  const y = useSpring(rawY, { stiffness: 60, damping: 20 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [rawX, rawY]);
  return { x, y };
}
