import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getCurrentDealerId } from "@/lib/dealer";
import { maskSsn, type FinancingApplication } from "@/lib/financing";
import { FinancingStatusSelect } from "@/components/admin/FinancingStatusSelect";

export default async function AdminFinancingPage() {
  const dealerId = await getCurrentDealerId();
  const { data, error } = await supabaseAdmin
    .from("financing_applications")
    .select("*, units(year, make, model)")
    .eq("dealer_id", dealerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  const applications = data as unknown as FinancingApplication[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-forest-dark mb-6">
        Financing Applications
      </h1>

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
                <p className="font-bold text-charcoal">{app.applicant_name}</p>
                <p className="text-sm text-charcoal-light">
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
                className="rounded border-2 border-charcoal/20 px-3 py-1.5 text-sm font-semibold hover:bg-charcoal/5"
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
