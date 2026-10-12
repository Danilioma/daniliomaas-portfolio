'use client';

import { useMotionValue, useSpring } from 'framer-motion';
import type { PointerEvent } from 'react';

/** Magnetic hover effect: returns spring values and pointer handlers. */
export function useMagnetic(strength = 0.25) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength * 1.2);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  return { style: { x: sx, y: sy }, onPointerMove, onPointerLeave: reset };
}
