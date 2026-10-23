import type { Metadata } from "next";
import { Libre_Bodoni, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const syne = Libre_Bodoni({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
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
  title: "AMPLIKAA — Agencia de Marketing Digital | Web, Sistemas y Campañas",
  description:
    "AMPLIKAA es una agencia de marketing digital en Maracay, Venezuela. Catálogo de webs y sistemas, clientes con campañas activas, y planes de marketing y desarrollo.",
  openGraph: {
    title: "AMPLIKAA — Agencia de Marketing Digital",
    description:
      "Web, sistemas, campañas y producción. El periódico completo de la agencia desde Maracay, Venezuela.",
    type: "website",
  },
  metadataBase: new URL("https://amplikaa.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${syne.variable} ${grotesk.variable} ${mono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
