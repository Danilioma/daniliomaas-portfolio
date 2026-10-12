'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useContact } from '@/components/ContactContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const links = [
  { href: '/#story', key: 'nav.story' },
  { href: '/#journey', key: 'nav.journey' },
  { href: '/#craft', key: 'nav.craft' },
  { href: '/#why', key: 'nav.why' },
  { href: '/contact', key: 'nav.contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const { open } = useContact();
  if (pathname === '/contact') return null;
  return (
    <nav
      aria-label="Main"
      className={`fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-gradient-to-b from-cream via-cream/90 to-transparent px-gutter pb-5 pt-[calc(18px+env(safe-area-inset-top,0px))] transition-opacity duration-500 ${
        open ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <Link href="/#top" className="font-serif text-2xl">
        Danilio Maas
      </Link>
      <ul className="ml-auto mr-4 flex gap-[clamp(14px,3vw,36px)] text-[15px] md:mr-7">
        {links.map((l, i) => (
          <li key={l.href} className={i < 4 ? 'hidden md:block' : ''}>
            <Link href={l.href} className="text-mute transition-colors hover:text-ink">
              {t(l.key)}
            </Link>
          </li>
        ))}
      </ul>
      <LanguageSwitcher />
    </nav>
  );
}
