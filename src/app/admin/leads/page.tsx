import { getSupabaseServer } from "@/lib/supabase/server";
import { requireUser } from "../_components/guard";
import { LeadsManager } from "./leads-manager";

export const dynamic = "force-dynamic";

export const metadata = { title: "Leads · Panel AMPLIKAA" };

export default async function LeadsPage() {
  await requireUser();
  const supabase = (await getSupabaseServer())!;

  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <p className="label-mono">CRM</p>
        <h1 className="headline text-3xl uppercase">Bandeja de leads</h1>
      </header>
      <LeadsManager leads={data ?? []} />
    </div>
  );
}
