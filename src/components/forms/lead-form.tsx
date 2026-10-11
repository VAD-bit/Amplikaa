"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect, useRef, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { leadSchema, type LeadInput } from "@/lib/schemas";
import { submitLead, type LeadState } from "@/app/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

const initial: LeadState = { status: "idle" };

const SERVICIOS = [
  "Ecosistemas Digitales (Web)",
  "Producción Audiovisual",
  "Desarrollo a Medida",
  "Branding & Diseño",
  "Performance & CRO",
  "Social & Contenido",
  "Plan: Impulso",
  "Plan: Crecimiento",
  "Plan: Ecosistema",
  "Cotización de proyecto único",
];

const PRESUPUESTOS = ["", "$100 – $300", "$300 – $700", "$700 – $1,500", "$1,500 – $3,000", "$3,000+"];

interface LeadFormProps {
  defaultValues?: Partial<LeadInput>;
  id?: string;
  compact?: boolean;
}

export function LeadForm({ defaultValues, id = "lead-form", compact = false }: LeadFormProps) {
  const [state, formAction, pending] = useActionState(submitLead, initial);
  const successRef = useRef<HTMLDivElement>(null);
  const [confetti, setConfetti] = useState(false);

  const {
    register,
    formState: { errors },
    reset,
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      nombre: "",
      email: "",
      whatsapp: "",
      empresa: "",
      servicio: "",
      presupuesto: "",
      mensaje: "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (state.status === "success") {
      setConfetti(true);
      reset();
      successRef.current?.focus();
      const t = setTimeout(() => setConfetti(false), 2400);
      return () => clearTimeout(t);
    }
  }, [state.status, reset]);

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className="relative corners glass rounded-2xl p-10 text-center focus:outline-none"
        role="status"
      >
        {confetti && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className="absolute top-0 block h-2 w-1.5 animate-confetti rounded-sm"
                style={{
                  left: `${(i * 100) / 18}%`,
                  background: i % 2 ? "#00F0FF" : "#7B2CBF",
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>
        )}
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-elec/10">
          <CheckCircle2 className="h-7 w-7 text-elec" aria-hidden="true" />
        </div>
        <h3 className="font-syne text-2xl font-extrabold uppercase">Solicitud recibida</h3>
        <p className="mt-3 text-gray-400">
          Te contactamos en menos de 24 horas con un plan de acción y presupuesto.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => reset({ nombre: "", email: "", whatsapp: "", empresa: "", servicio: "", presupuesto: "", mensaje: "" })}>
          Enviar otra solicitud
        </Button>
      </div>
    );
  }

  return (
    <form id={id} action={formAction} noValidate className="corners glass relative rounded-2xl p-7 sm:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-nombre`} className="label-mono mb-2 block">Nombre *</label>
          <Input id={`${id}-nombre`} autoComplete="name" placeholder="Tu nombre" aria-invalid={!!errors.nombre} {...register("nombre")} />
          {errors.nombre && <p className="mt-1.5 text-xs text-red-400">{errors.nombre.message}</p>}
          {state.errors?.nombre && <p className="mt-1.5 text-xs text-red-400">{state.errors.nombre}</p>}
        </div>
        <div>
          <label htmlFor={`${id}-empresa`} className="label-mono mb-2 block">Empresa</label>
          <Input id={`${id}-empresa`} autoComplete="organization" placeholder="Marca o empresa" {...register("empresa")} />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="label-mono mb-2 block">Email *</label>
          <Input id={`${id}-email`} type="email" autoComplete="email" placeholder="tu@email.com" aria-invalid={!!errors.email} {...register("email")} />
          {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
          {state.errors?.email && <p className="mt-1.5 text-xs text-red-400">{state.errors.email}</p>}
        </div>
        <div>
          <label htmlFor={`${id}-whatsapp`} className="label-mono mb-2 block">WhatsApp *</label>
          <Input id={`${id}-whatsapp`} type="tel" autoComplete="tel" placeholder="+58 4XX XXX XXXX" aria-invalid={!!errors.whatsapp} {...register("whatsapp")} />
          {errors.whatsapp && <p className="mt-1.5 text-xs text-red-400">{errors.whatsapp.message}</p>}
          {state.errors?.whatsapp && <p className="mt-1.5 text-xs text-red-400">{state.errors.whatsapp}</p>}
        </div>
        <div>
          <label htmlFor={`${id}-servicio`} className="label-mono mb-2 block">Servicio *</label>
          <Select id={`${id}-servicio`} aria-invalid={!!errors.servicio} {...register("servicio")}>
            <option value="">Selecciona…</option>
            {SERVICIOS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
          {errors.servicio && <p className="mt-1.5 text-xs text-red-400">{errors.servicio.message}</p>}
          {state.errors?.servicio && <p className="mt-1.5 text-xs text-red-400">{state.errors.servicio}</p>}
        </div>
        <div>
          <label htmlFor={`${id}-presupuesto`} className="label-mono mb-2 block">Presupuesto (USD)</label>
          <Select id={`${id}-presupuesto`} {...register("presupuesto")}>
            {PRESUPUESTOS.map((p) => (
              <option key={p} value={p}>{p || "Por definir"}</option>
            ))}
          </Select>
        </div>
      </div>

      {!compact && (
        <div className="mt-5">
          <label htmlFor={`${id}-mensaje`} className="label-mono mb-2 block">¿Qué necesitas? *</label>
          <Textarea id={`${id}-mensaje`} rows={4} placeholder="Cuéntanos sobre tu proyecto, objetivos y plazos…" aria-invalid={!!errors.mensaje} {...register("mensaje")} />
          {errors.mensaje && <p className="mt-1.5 text-xs text-red-400">{errors.mensaje.message}</p>}
          {state.errors?.mensaje && <p className="mt-1.5 text-xs text-red-400">{state.errors.mensaje}</p>}
        </div>
      )}
      {compact && (
        <>
          <input type="hidden" value="Cotización de proyecto único" {...register("servicio")} />
          <div className="mt-5">
            <label htmlFor={`${id}-mensaje`} className="label-mono mb-2 block">¿Qué necesitas? *</label>
            <Textarea id={`${id}-mensaje`} rows={3} placeholder="Cuéntanos de tu proyecto…" aria-invalid={!!errors.mensaje} {...register("mensaje")} />
            {errors.mensaje && <p className="mt-1.5 text-xs text-red-400">{errors.mensaje.message}</p>}
          </div>
        </>
      )}

      {state.status === "error" && state.message && (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-400/5 p-4 text-sm text-red-300" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {state.message}
        </div>
      )}

      <Button type="submit" className="mt-7 w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Enviando…
          </>
        ) : (
          "Enviar solicitud"
        )}
      </Button>
      <p className="mt-4 text-center font-mono text-[11px] text-gray-500">
        Respondemos en menos de 24 h · Sin compromiso
      </p>
    </form>
  );
}
