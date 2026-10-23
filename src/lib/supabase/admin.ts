import { createClient } from "@supabase/supabase-js";
import { AMPLIKAA_SCHEMA } from "@/lib/supabase/client";

/**
 * Cliente con service role (bypass RLS). SOLO para server-side scripts/actions
 * que necesiten privilegios de administración (crear usuarios, migrar datos).
 * Nunca importar desde componentes de cliente.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !service) return null;

  return createClient(url, service, {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: AMPLIKAA_SCHEMA },
  });
}
