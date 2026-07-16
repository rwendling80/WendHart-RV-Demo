import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getCurrentDealerId } from "@/lib/dealer";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { FinancingStatusSelect } from "@/components/admin/FinancingStatusSelect";
import { maskSsn, type FinancingApplication } from "@/lib/financing";

type LeadRow = {
  id: string;
  name: string | null;
  phone: string | null;
  message: string | null;
  status: string;
  source: string;
  intent_level: "HOT" | "WARM" | "BROWSE" | null;
  created_at: string;
  units: { year: number | null; make: string | null; model: string | null } | null;
};

type ChatTranscript = {
  lead_id: string;
  messages: { role: "user" | "assistant"; content: string }[];
};

const INTENT_BADGE_STYLES: Record<string, string> = {
  HOT: "bg-rust text-white",
  WARM: "bg-forest text-cream",
  BROWSE: "bg-charcoal/10 text-charcoal-light",
};

export default async function AdminLeadsPage() {
  const dealerId = await getCurrentDealerId();

  const [leadsResult, financingResult, chatResult] = await Promise.all([
    supabaseAdmin
      .from("leads")
      .select("*, units(year, make, model)")
      .eq("dealer_id", dealerId)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("financing_applications")
      .select("*, units(year, make, model)")
      .eq("dealer_id", dealerId)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("chat_conversations")
      .select("lead_id, messages")
      .eq("dealer_id", dealerId)
      .not("lead_id", "is", null),
  ]);

  if (leadsResult.error) throw leadsResult.error;
  if (financingResult.error) throw financingResult.error;
  if (chatResult.error) throw chatResult.error;

  const leads = leadsResult.data as unknown as LeadRow[];
  const applications = financingResult.data as unknown as FinancingApplication[];
  const transcriptsByLeadId = new Map(
    (chatResult.data as unknown as ChatTranscript[]).map((c) => [c.lead_id, c.messages])
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-forest-dark mb-1">
        Leads &amp; Applications
      </h1>
      <p className="text-lg text-charcoal-light mb-6">
        Who&apos;s asked about your units
      </p>

      <h2 className="text-xl font-bold text-charcoal mb-3">Inquiries</h2>
      {leads.length === 0 ? (
        <p className="text-lg text-charcoal-light mb-8">
          No inquiries yet — they&apos;ll show up here automatically as
          people submit the form on unit pages.
        </p>
      ) : (
        <div className="space-y-3 mb-10">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-lg border-2 border-charcoal/10 bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-charcoal">
                    {lead.name || "Anonymous chat visitor"} ·{" "}
                    {lead.phone || "no number yet"}
                    {lead.source === "financing" && (
                      <span className="ml-2 rounded bg-rust px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white align-middle">
                        Financing
                      </span>
                    )}
                    {lead.source === "chatbot" && (
                      <span className="ml-2 rounded bg-charcoal px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white align-middle">
                        Chatbot
                      </span>
                    )}
                    {lead.intent_level && (
                      <span
                        className={`ml-2 rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wider align-middle ${INTENT_BADGE_STYLES[lead.intent_level]}`}
                      >
                        {lead.intent_level}
                      </span>
                    )}
                  </p>
                  <p className="text-base text-charcoal-light">
                    {new Date(lead.created_at).toLocaleString()} ·{" "}
                    {lead.units
                      ? `${lead.units.year ?? ""} ${lead.units.make ?? ""} ${lead.units.model ?? ""}`.trim()
                      : "General inquiry"}
                  </p>
                  {lead.message && (
                    <p className="mt-2 text-lg">{lead.message}</p>
                  )}
                  {transcriptsByLeadId.has(lead.id) && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm font-semibold text-forest">
                        View chat transcript
                      </summary>
                      <div className="mt-2 space-y-1 rounded bg-charcoal/5 p-3 text-sm">
                        {transcriptsByLeadId.get(lead.id)?.map((m, i) => (
                          <p key={i}>
                            <span className="font-bold">
                              {m.role === "user" ? "Buyer: " : "Assistant: "}
                            </span>
                            {m.content}
                          </p>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
                <LeadStatusSelect leadId={lead.id} status={lead.status} />
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-xl font-bold text-charcoal mb-3">
        Financing Applications
      </h2>
      {applications.length === 0 ? (
        <p className="text-lg text-charcoal-light">
          No applications yet — they&apos;ll show up here automatically when
          someone applies from the site.
        </p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="flex flex-wrap items-center gap-4 rounded-lg border-2 border-charcoal/10 bg-white p-4"
            >
              <div className="flex-1 min-w-[220px]">
                <p className="text-lg font-bold text-charcoal">
                  {app.applicant_name}
                </p>
                <p className="text-base text-charcoal-light">
                  {new Date(app.created_at).toLocaleDateString()} ·{" "}
                  {app.units
                    ? `${app.units.year ?? ""} ${app.units.make ?? ""} ${app.units.model ?? ""}`.trim()
                    : "Not sure yet"}{" "}
                  · SSN {maskSsn(app.applicant_ssn_last4)}
                </p>
              </div>
              <FinancingStatusSelect applicationId={app.id} status={app.status} />
              <Link
                href={`/admin/financing/${app.id}/print`}
                className="rounded border-2 border-charcoal/20 px-4 py-2.5 text-base font-semibold hover:bg-charcoal/5"
              >
                Print View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
