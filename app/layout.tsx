import type { Metadata, Viewport } from 'next';
import { Hanken_Grotesk, Instrument_Serif } from 'next/font/google';
import '@/styles/orbit.css';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';
import { site } from '@/lib/site';

const serif = Instrument_Serif({ weight: '400', style: ['normal', 'italic'], subsets: ['latin'], variable: '--font-serif', display: 'swap' });
const sans = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

const description =
  'Personal website of Danilio Maas: marketing and communication intern in Venlo, with ambitions in sport marketing, digital innovation and AI. Open to internships abroad.';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Danilio Maas | Marketing & Communication', template: '%s | Danilio Maas' },
  description,
  applicationName: 'Danilio Maas',
  authors: [{ name: 'Danilio Maas', url: site.url }],
  keywords: ['Danilio Maas', 'marketing', 'communication', 'sport marketing', 'AI', 'digital innovation', 'branding', 'content creation', 'internship', 'Venlo'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: site.url,
    siteName: 'Danilio Maas',
    title: 'Danilio Maas | Marketing & Communication',
    description,
    locale: 'en_US',
    alternateLocale: ['nl_NL'],
    images: [{ url: '/images/og.jpg', width: 1200, height: 630, alt: 'Danilio Maas' }],
  },
  twitter: { card: 'summary_large_image', title: 'Danilio Maas | Marketing & Communication', description, images: ['/images/og.jpg'] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: '#F4EFE7', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Danilio Maas',
  url: site.url,
  image: `${site.url}/images/portrait.jpg`,
  jobTitle: 'Marketing & Communication Intern',
  email: `mailto:${site.email}`,
  homeLocation: { '@type': 'Place', name: 'Venlo, Netherlands' },
  alumniOf: { '@type': 'EducationalOrganization', name: 'De Rooi Pannen' },
  worksFor: { '@type': 'Organization', name: 'Bibliotheek Venlo' },
  knowsAbout: ['Marketing', 'Communication', 'Sport marketing', 'Branding', 'Content creation', 'Digital innovation', 'AI'],
  sameAs: [site.linkedin, site.instagram],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers>
          <Navbar />
          <main id="main">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
