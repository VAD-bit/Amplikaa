"use client";

import { useEffect, useState } from "react";
import { WaIcon } from "@/components/icons/wa-icon";
import { WA_DEFAULT } from "@/lib/config";

export function FloatingWhatsapp() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={WA_DEFAULT}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className={
        "glow-elec fixed right-6 bottom-6 z-50 grid h-14 w-14 cursor-pointer place-items-center rounded-full glass text-elec transition-all duration-300 hover:bg-elec hover:text-black " +
        (show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0")
      }
    >
      <WaIcon className="h-6 w-6" />
    </a>
  );
}
