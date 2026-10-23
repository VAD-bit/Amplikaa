import type { ReactNode } from "react";

export function Kpi({
  label,
  value,
  sub,
  tone,
  labelTone,
}: {
  label: string;
  value: string | number;
  sub?: ReactNode;
  tone?: string;
  labelTone?: string;
}) {
  return (
    <div className="glass-dark rounded-xl p-5">
      <p className={`font-mono text-[11px] uppercase tracking-[0.22em] ${labelTone ?? "text-ink-mute"}`}>{label}</p>
      <p className={`headline mt-2 text-4xl text-3d sm:text-5xl ${tone ?? ""}`}>{value}</p>
      {sub && <p className="mt-1 font-mono text-[10px] text-ink-mute">{sub}</p>}
    </div>
  );
}
