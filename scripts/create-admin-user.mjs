#!/usr/bin/env node
// Crea (o confirma) el usuario de Supabase Auth para /admin/login.
// Uso: node scripts/create-admin-user.mjs tu@email.com [contraseña]
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

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
const password = process.argv[3] || randomBytes(9).toString("base64url");

if (!url || !service) {
  console.error("Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}
if (!email || !email.includes("@")) {
  console.error("Uso: node scripts/create-admin-user.mjs tu@email.com [contraseña]");
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

const existing = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
if (existing) {
  console.log(`El usuario ${email} ya existe (id ${existing.id}).`);
  console.log("Si olvidaste la contraseña, repítelo desde el Dashboard de Supabase → Authentication → Users.");
  process.exit(0);
}

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error) {
  console.error("Error creando usuario:", error.message);
  process.exit(1);
}

console.log("✓ Usuario creado:", email, `(id ${data.user.id})`);
console.log("Contraseña temporal (guárdala y cámbiala):", password);
console.log("Entra en /admin/login con esos datos.");
