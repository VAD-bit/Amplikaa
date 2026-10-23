export function fmtDate(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso.includes("T") ? iso : `${iso}T12:00:00`);
  return d.toLocaleDateString("es-VE", { day: "2-digit", month: "short", year: "numeric" });
}

export function fmtDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-VE", { day: "2-digit", month: "short" }) +
    " " +
    d.toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" });
}

export function fmtMoney(n: number | null | undefined) {
  if (n == null) return "—";
  return `$${Number(n).toLocaleString("es-VE", { maximumFractionDigits: 0 })}`;
}

export function daysFromToday(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const target = new Date(`${iso.slice(0, 10)}T12:00:00`);
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}
