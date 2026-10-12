import type { Metadata } from 'next';
import { ContactPageView } from '@/components/ContactPageView';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Danilio Maas about internships, projects and collaborations in marketing, sport and digital innovation.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return <ContactPageView />;
}
