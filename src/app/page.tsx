import { Hero } from "@/components/home/hero";
import { MetricsMarquee } from "@/components/home/metrics-marquee";
import { Services } from "@/components/home/services";
import { Portfolio } from "@/components/home/portfolio";
import { Process } from "@/components/home/process";
import { Pricing } from "@/components/home/pricing";
import { Testimonials } from "@/components/home/testimonials";
import { Faq } from "@/components/home/faq";
import { CtaBanner } from "@/components/home/cta-banner";
import { ContactSection } from "@/components/home/contact-section";
import { FloatingWhatsapp } from "@/components/layout/floating-whatsapp";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <MetricsMarquee />
      <Services />
      <Portfolio />
      <Process />
      <Pricing />
      <Testimonials />
      <Faq />
      <CtaBanner />
      <ContactSection />
      <FloatingWhatsapp />
    </main>
  );
}
