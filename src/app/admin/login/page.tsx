import { LoginForm } from "./login-form";
import { AdminBackdrop } from "../_components/backdrop";

export const metadata = { title: "Acceso · Panel AMPLIKAA" };

export default function AdminLoginPage() {
  return (
    <main className="admin-shell relative grid min-h-dvh place-items-center overflow-hidden px-5">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <AdminBackdrop />
        <div className="grid-bg absolute inset-0 opacity-40" />
      </div>
      <div className="relative z-10 w-full max-w-sm">
        <p className="mb-8 text-center font-mono text-[11px] uppercase tracking-[0.35em] text-ink-mute">
          AMPLIKAA · Consola interna
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
