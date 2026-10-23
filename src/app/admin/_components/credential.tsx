"use client";

type CredentialProps = {
  nombre: string;
  apellido?: string | null;
  cargo: string;
  avatar?: string | null;
  email?: string | null;
};

export function Credential({ nombre, apellido, cargo, avatar, email }: CredentialProps) {
  const initial = nombre.trim()[0]?.toUpperCase() ?? "A";

  return (
    <div className="mt-3 w-fit" title={email ?? ""}>
      <div className="relative h-[216px] w-[104px] rounded-[26px] border border-white/25 bg-black p-[4px] shadow-[0_26px_52px_-22px_rgba(0,0,0,0.95)]">
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[22px] bg-gradient-to-b from-sky/25 via-viol/15 to-black/85">
          <div className="relative z-10 flex items-center justify-between px-3 pt-1.5 font-mono text-[7px] text-white/75" aria-hidden="true">
            <span>9:41</span>
            <span>▮▮</span>
          </div>
          <span
            className="absolute left-1/2 top-[7px] z-10 h-[11px] w-[38px] -translate-x-1/2 rounded-full bg-black"
            aria-hidden="true"
          />

          {/* IMAGEN */}
          <div className="relative h-[104px] w-full shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={`Foto de ${nombre} ${apellido ?? ""}`.trim()}
                className="h-full w-full object-contain object-center"
              />
            ) : (
              <div className="grid h-full w-full place-items-center">
                <span className="font-syne text-4xl font-bold text-white/90" aria-hidden="true">
                  {initial}
                </span>
              </div>
            )}
            <div
              className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/90 to-transparent"
              aria-hidden="true"
            />
          </div>

          {/* NOMBRE / APELLIDO / CARGO */}
          <div className="mt-auto px-2 pb-3 text-center">
            <p className="font-syne text-[15px] font-bold uppercase leading-none tracking-wide text-white">{nombre}</p>
            {apellido && (
              <p className="mt-1 font-syne text-[15px] font-bold uppercase leading-none tracking-wide text-white">
                {apellido}
              </p>
            )}
            <span className="mx-auto mt-2 block h-px w-8 bg-white/30" aria-hidden="true" />
            <p className="mt-2 font-mono text-[7.5px] font-bold uppercase leading-tight tracking-[0.06em] text-white/70">
              {cargo}
            </p>
            <span className="mx-auto mt-2 block h-[3px] w-9 rounded-full bg-white/75" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
