#!/usr/bin/env node
// Actualiza user_metadata (nombre, cargo, avatar) del usuario admin para la credencial del panel.
// Uso: node scripts/set-admin-meta.mjs victor@amplikaa.com [ruta_o_url_avatar]
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

function readEnv() {
  try {
    const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    const env = {};
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
    return env;
  } catch {
    return process.env;
  }
}

const env = readEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const service = env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.argv[2];
const avatar = process.argv[3];

if (!url || !service) {
  console.error("Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}
if (!email || !email.includes("@")) {
  console.error("Uso: node scripts/set-admin-meta.mjs victor@amplikaa.com [ruta_o_url_avatar]");
  process.exit(1);
}

const supabase = createClient(url, service, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: list, error: listErr } = await supabase.auth.admin.listUsers();
if (listErr) {
  console.error("Error listando usuarios:", listErr.message);
  process.exit(1);
}

const user = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
if (!user) {
  console.error(`No existe el usuario ${email}.`);
  process.exit(1);
}

const meta = {
  ...(user.user_metadata ?? {}),
  nombre: "Víctor",
  apellido: "Díaz",
  full_name: "Víctor Díaz",
  cargo: "CEO & Fundador",
  avatar_url: avatar || "/equipo/victor.png",
};

const { error } = await supabase.auth.admin.updateUserById(user.id, { user_metadata: meta });
if (error) {
  console.error("Error actualizando metadatos:", error.message);
  process.exit(1);
}

console.log("✓ Metadatos actualizados:", email, `(${user.id})`);
console.log(JSON.stringify(meta, null, 2));
