'use client';

import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

export type GalleryImage = { src: string; alt: string; className: string; speed?: number; position?: string };

/** Layered images with GSAP ScrollTrigger parallax. */
export function ImageGallery({ images, className }: { images: GalleryImage[]; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-par]').forEach((el) => {
        const s = Number(el.dataset.par) || 8;
        gsap.fromTo(el, { yPercent: -s }, { yPercent: s, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      gsap.from('[data-reveal]', {
        clipPath: 'inset(100% 0 0 0)',
        duration: 1.4,
        ease: 'expo.out',
        stagger: 0.2,
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={`relative ${className ?? ''}`}>
      {images.map((img) => (
        <div key={img.src} data-reveal className={`absolute overflow-hidden rounded-md shadow-soft ${img.className}`}>
          <div data-par={img.speed ?? 8} className="absolute -inset-y-[10%] inset-x-0">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 1024px) 80vw, 40vw"
              className={`object-cover ${img.position ?? 'object-center'}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
