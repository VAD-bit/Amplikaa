import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const env = {};
for (const line of raw.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  db: { schema: "amplikaa" },
});

async function probe(table) {
  const { data, error } = await supabase.from(table).select("id").limit(1);
  if (error) return `${table}: ERROR → ${error.message}`;
  return `${table}: OK (conectado)`;
}

console.log(await probe("leads"));
console.log(await probe("studio_submissions"));
console.log(await probe("clients"));
console.log(await probe("tasks"));
console.log(await probe("notes"));
