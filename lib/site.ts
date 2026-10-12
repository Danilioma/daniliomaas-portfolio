export const site = {
  name: 'Danilio Maas',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://danilio-maas.vercel.app').replace(/\/$/, ''),
  email: '210365@student.derooipannen.nl',
  linkedin: 'https://www.linkedin.com/in/danilio-maas/',
  instagram: 'https://www.instagram.com/danilio.ma/',
  cv: '/cv/CV-Danilio-Maas.pdf',
  // SHA-256 of the access password. The password itself is never stored in the code.
  accessHash:
    process.env.NEXT_PUBLIC_ACCESS_HASH || '754c6569cecd41af2bbd9b10666dfe6f89a20c8408ce4f5d000b9fa2669c355b',
  storageKeys: { auth: 'dm-ok', lang: 'dm-lang' },
} as const;

export type Locale = 'en' | 'nl';
export const locales: Locale[] = ['en', 'nl'];
