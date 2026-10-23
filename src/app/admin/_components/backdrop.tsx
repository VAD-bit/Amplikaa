"use client";

import { useEffect, useRef } from "react";

export function AdminBackdrop() {
  const aRef = useRef<HTMLSpanElement>(null);
  const bRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    let lit: boolean | null = null;

    const tick = () => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const threshold = Math.min(window.innerWidth, window.innerHeight) * 0.28;
      const thresholdSq = threshold * threshold;

      let next = false;
      for (const el of [aRef.current, bRef.current]) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const dx = r.left + r.width / 2 - cx;
        const dy = r.top + r.height / 2 - cy;
        if (dx * dx + dy * dy <= thresholdSq) {
          next = true;
          break;
        }
      }

      if (next !== lit && wordRef.current) {
        wordRef.current.classList.toggle("lit", next);
        lit = next;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <span ref={aRef} className="beam beam-a" />
      <span ref={bRef} className="beam beam-b" />
      <span ref={wordRef} className="beam-word">AMPLIKAA</span>
    </div>
  );
}
