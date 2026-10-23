import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabase/server";
import { PanelDock } from "./_components/dock";
import { AdminBackdrop } from "./_components/backdrop";
import { Credential } from "./_components/credential";

export const metadata = {
  title: "Panel · AMPLIKAA",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

  if (!user) return <>{children}</>;

  const meta = (user.user_metadata ?? {}) as {
    nombre?: string | null;
    apellido?: string | null;
    full_name?: string | null;
    cargo?: string | null;
    avatar_url?: string | null;
  };
  const fallbackName = (user.email ?? "equipo").split("@")[0];
  const words = (meta.full_name ?? "").trim().split(/\s+/).filter(Boolean);
  const nombre = (meta.nombre || words[0] || fallbackName).trim() || "Equipo";
  const apellido = (meta.apellido ?? words.slice(1).join(" ")) || null;
  const cargo = meta.cargo || "Administrador";

  return (
    <div className="admin-shell text-ink">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <AdminBackdrop />
        <div className="grid-bg absolute inset-0 opacity-40" />
      </div>

      {/* Marca */}
      <div className="relative z-20 px-4 pt-6 pr-16 sm:px-6 sm:pr-6 sm:pt-4">
        <Link href="/admin" className="flex w-fit items-center gap-2.5" aria-label="Panel AMPLIKAA">
          <span className="h-2.5 w-2.5 rounded-full bg-sky" aria-hidden="true" />
          <span className="font-syne text-lg font-bold uppercase tracking-tight">
            AMPLIK<span className="italic">AA</span>
          </span>
          <span className="rounded-full border border-white/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-ink-mute">
            Panel
          </span>
        </Link>
        <Credential
          nombre={nombre}
          apellido={apellido}
          cargo={cargo}
          avatar={meta.avatar_url}
          email={user.email}
        />
      </div>
      <div className="relative z-10">
        <main className="mx-auto max-w-6xl px-3 py-5 sm:px-5 sm:py-7 lg:px-8">{children}</main>
      </div>

      <PanelDock />
    </div>
  );
}
