import { supabaseAdmin } from "@/lib/supabase/server";
import { getCurrentDealerId } from "@/lib/dealer";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";

type LeadRow = {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  status: string;
  source: string;
  created_at: string;
  units: { year: number | null; make: string | null; model: string | null } | null;
};

export default async function AdminLeadsPage() {
  const dealerId = await getCurrentDealerId();
  const { data, error } = await supabaseAdmin
    .from("leads")
    .select("*, units(year, make, model)")
    .eq("dealer_id", dealerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  const leads = data as unknown as LeadRow[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-forest-dark mb-6">
        Lead Log
      </h1>

      {leads.length === 0 ? (
        <p className="text-lg text-charcoal-light">
          No inquiries yet — they&apos;ll show up here automatically as
          people submit the form on unit pages.
        </p>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-lg border-2 border-charcoal/10 bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-charcoal">
                    {lead.name} · {lead.phone}
                    {lead.source === "financing" && (
                      <span className="ml-2 rounded bg-rust px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white align-middle">
                        Financing
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-charcoal-light">
                    {new Date(lead.created_at).toLocaleString()} ·{" "}
                    {lead.units
                      ? `${lead.units.year ?? ""} ${lead.units.make ?? ""} ${lead.units.model ?? ""}`.trim()
                      : "General inquiry"}
                  </p>
                  {lead.message && (
                    <p className="mt-2 text-lg">{lead.message}</p>
                  )}
                </div>
                <LeadStatusSelect leadId={lead.id} status={lead.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
