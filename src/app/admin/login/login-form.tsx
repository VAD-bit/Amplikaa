"use client";

import { useActionState } from "react";
import { Loader2, Lock } from "lucide-react";
import { login } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, { status: "idle" as const });

  return (
    <form action={action} className="glass-dark relative w-full max-w-sm rounded-2xl p-8">
      <span
        className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rounded-sm bg-mark/70 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="mb-6 flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-white/6">
          <Lock className="h-4 w-4 text-sky" aria-hidden="true" />
        </span>
        <div>
          <h1 className="headline text-xl uppercase">Panel AMPLIKAA</h1>
        </div>
      </div>

      <label htmlFor="email" className="label-mono mb-2 block">Email</label>
      <Input id="email" name="email" type="email" autoComplete="email" placeholder="tu@email.com" required />

      <label htmlFor="password" className="label-mono mb-2 mt-4 block">Contraseña</label>
      <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" required />

      {state.status === "error" && state.message && (
        <p
          className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-300"
          role="alert"
        >
          {state.message}
        </p>
      )}

      <Button type="submit" className="mt-6 w-full" disabled={pending}>
        {pending ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Entrando…
          </span>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  );
}
