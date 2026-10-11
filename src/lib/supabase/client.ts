import { createBrowserClient } from "@supabase/ssr";

/** Schema donde viven las tablas de AMPLIKAA (ver supabase/migrations). */
export const AMPLIKAA_SCHEMA = "amplikaa";

export function getSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) return null;

  return createBrowserClient(url, anon, {
    db: { schema: AMPLIKAA_SCHEMA },
  });
}
