import { Hero } from "@/components/home/hero";
import { MetricsMarquee } from "@/components/home/metrics-marquee";
import { Services } from "@/components/home/services";
import { Portfolio } from "@/components/home/portfolio";
import { Clients } from "@/components/home/clients";
import { Team } from "@/components/home/team";
import { Process } from "@/components/home/process";
import { Pricing } from "@/components/home/pricing";
import { Testimonials } from "@/components/home/testimonials";
import { Faq } from "@/components/home/faq";
import { CtaBanner } from "@/components/home/cta-banner";
import { ContactSection } from "@/components/home/contact-section";
import { FloatingWhatsapp } from "@/components/layout/floating-whatsapp";
import { getLandingPlanes } from "@/lib/negocio/planes";

export const revalidate = 60;

export default async function HomePage() {
  const planes = await getLandingPlanes();

  return (
    <main>
      <Hero />
      <MetricsMarquee />
      <Services />
      <Portfolio />
      <Clients />
      <Team />
      <Process />
      <Pricing planes={planes} />
      <Testimonials />
      <Faq />
      <CtaBanner />
      <ContactSection />
      <FloatingWhatsapp />
    </main>
  );
}
