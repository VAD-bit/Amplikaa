import type { Metadata } from "next";
import { Syne, Space_Grotesk, Space_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AMPLIKAA — Agencia de Marketing Digital | Ecosistemas, Producción y Desarrollo",
  description:
    "AMPLIKAA es una agencia de marketing digital en Venezuela. Creamos ecosistemas digitales, producción audiovisual y desarrollo web que convierten atención en crecimiento.",
  openGraph: {
    title: "AMPLIKAA — High-End Brand Agency",
    description: "Digital Ecosystems · Production · Development. Agencia de marketing digital en Venezuela.",
    type: "website",
  },
  metadataBase: new URL("https://amplikaa.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${syne.variable} ${grotesk.variable} ${mono.variable}`}>
      <body className="antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
