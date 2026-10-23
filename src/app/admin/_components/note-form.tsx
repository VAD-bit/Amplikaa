"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { addNote } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function NoteForm({ leadId, clientId }: { leadId?: string; clientId?: string }) {
  const [state, action, pending] = useActionState(addNote, { status: "idle" as const });
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") ref.current?.reset();
  }, [state.status]);

  return (
    <form ref={ref} action={action} className="glass-dark rounded-xl p-4">
      <input type="hidden" name="lead_id" value={leadId || ""} />
      <input type="hidden" name="client_id" value={clientId || ""} />
      <label className="label-mono mb-2 block" htmlFor={`note-${leadId ?? clientId}`}>
        Nueva nota
      </label>
      <Textarea
        id={`note-${leadId ?? clientId}`}
        name="texto"
        rows={3}
        placeholder="Llamada hecha, interés real en X, follow-up el viernes…"
      />
      {state.status === "error" && state.message && (
        <p className="mt-2 text-xs text-red-300">{state.message}</p>
      )}
      <Button type="submit" variant="outline" size="sm" className="mt-3" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : "Guardar nota"}
      </Button>
    </form>
  );
}
