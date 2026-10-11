import type { Metadata } from "next";
import { ContactSection } from "@/components/home/contact-section";
import { FloatingWhatsapp } from "@/components/layout/floating-whatsapp";

export const metadata: Metadata = {
  title: "Contacto — AMPLIKAA",
  description: "Solicita tu proyecto con AMPLIKAA. Respondemos en menos de 24 horas.",
};

interface PageProps {
  searchParams: Promise<{ servicio?: string; presupuesto?: string }>;
}

export default async function ContactoPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <main className="pt-28">
      <ContactSection
        defaultServicio={params.servicio}
        defaultPresupuesto={params.presupuesto}
      />
      <FloatingWhatsapp />
    </main>
  );
}
