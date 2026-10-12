'use client';

import Link from 'next/link';
import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { useMagnetic } from '@/hooks/useMagnetic';

type ButtonProps = Omit<HTMLMotionProps<'button'>, 'ref' | 'style' | 'children'> & { children: ReactNode };

export function MagneticButton({ children, ...rest }: ButtonProps) {
  const m = useMagnetic();
  return (
    <motion.button type="button" {...rest} {...m}>
      {children}
    </motion.button>
  );
}

const MotionLink = motion.create(Link);

type LinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  download?: boolean;
  'aria-label'?: string;
  onClick?: () => void;
};

export function MagneticLink({ href, children, external, download, ...rest }: LinkProps) {
  const m = useMagnetic();
  if (external || download) {
    return (
      <motion.a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...(download ? { download: true } : {})}
        {...rest}
        {...m}
      >
        {children}
      </motion.a>
    );
  }
  return (
    <MotionLink href={href} {...rest} {...m}>
      {children}
    </MotionLink>
  );
}
