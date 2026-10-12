import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { CareerJourney } from '@/components/CareerJourney';
import { ContentCreation } from '@/components/ContentCreation';
import { AnimatedBanner } from '@/components/AnimatedBanner';
import { WhyCompanies } from '@/components/WhyCompanies';
import { International } from '@/components/International';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <CareerJourney />
      <ContentCreation />
      <AnimatedBanner />
      <WhyCompanies />
      <International />
      <ContactSection />
      <Footer />
    </>
  );
}
