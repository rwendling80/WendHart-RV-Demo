import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getCurrentDealer } from "@/lib/dealer";
import { decrypt } from "@/lib/financeCrypto";
import { formatCurrency, type FinancingApplication } from "@/lib/financing";
import { PrintButton } from "@/components/admin/PrintButton";

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="py-1">
      <span className="font-semibold">{label}:</span> {value}
    </div>
  );
}

export default async function FinancingPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dealer = await getCurrentDealer();

  const { data, error } = await supabaseAdmin
    .from("financing_applications")
    .select("*, units(year, make, model)")
    .eq("id", id)
    .eq("dealer_id", dealer.id)
    .maybeSingle();

  if (error) throw error;
  if (!data) notFound();

  const app = data as unknown as FinancingApplication;

  if (app.status === "New") {
    await supabaseAdmin
      .from("financing_applications")
      .update({ status: "Printed" })
      .eq("id", app.id)
      .eq("dealer_id", dealer.id);
  }

  const applicantSsn = decrypt(app.applicant_ssn_encrypted);
  const applicantDob = decrypt(app.applicant_dob_encrypted);
  const coSsn = app.co_ssn_encrypted ? decrypt(app.co_ssn_encrypted) : null;
  const coDob = app.co_dob_encrypted ? decrypt(app.co_dob_encrypted) : null;

  const unitLabel = app.units
    ? `${app.units.year ?? ""} ${app.units.make ?? ""} ${app.units.model ?? ""}`.trim()
    : "Not sure yet";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-base">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <p className="font-semibold text-charcoal-light">
          Print View — full SSN visible here only
        </p>
        <PrintButton />
      </div>

      <div className="rounded-lg border-2 border-charcoal/20 bg-white p-8 print:border-0 print:p-0">
        <h1 className="text-2xl font-extrabold text-center mb-1">
          Retail Credit Application
        </h1>
        <p className="text-center text-charcoal-light mb-6">{dealer.name}</p>

        <h2 className="text-lg font-bold border-b border-charcoal/20 mb-2 mt-4">
          Unit of Interest
        </h2>
        <Field label="Unit" value={unitLabel} />

        <h2 className="text-lg font-bold border-b border-charcoal/20 mb-2 mt-4">
          Applicant
        </h2>
        <Field label="Name" value={app.applicant_name} />
        <Field label="Address" value={app.applicant_address} />
        <Field label="Time at Address" value={app.applicant_time_at_address} />
        <Field label="Housing Status" value={app.applicant_housing_status} />
        <Field label="Monthly Housing Payment" value={formatCurrency(app.applicant_housing_payment_cents)} />
        <Field label="Phone" value={app.applicant_phone} />
        <Field label="Email" value={app.applicant_email} />
        <Field label="Date of Birth" value={applicantDob} />
        <Field label="Social Security Number" value={applicantSsn} />
        <Field label="Driver's License" value={
          app.applicant_dl_number
            ? `${app.applicant_dl_number}${app.applicant_dl_state ? ` (${app.applicant_dl_state})` : ""}`
            : null
        } />
        <Field label="Employer" value={app.applicant_employer} />
        <Field label="Position" value={app.applicant_position} />
        <Field label="Time on Job" value={app.applicant_time_on_job} />
        <Field label="Work Phone" value={app.applicant_work_phone} />
        <Field label="Gross Monthly Income" value={formatCurrency(app.applicant_gross_monthly_income_cents)} />
        <Field label="Other Income" value={formatCurrency(app.applicant_other_income_cents)} />

        {app.has_coapplicant && (
          <>
            <h2 className="text-lg font-bold border-b border-charcoal/20 mb-2 mt-4">
              Co-Applicant
            </h2>
            <Field label="Name" value={app.co_name} />
            <Field label="Address" value={app.co_address} />
            <Field label="Time at Address" value={app.co_time_at_address} />
            <Field label="Housing Status" value={app.co_housing_status} />
            <Field label="Monthly Housing Payment" value={formatCurrency(app.co_housing_payment_cents)} />
            <Field label="Phone" value={app.co_phone} />
            <Field label="Email" value={app.co_email} />
            <Field label="Date of Birth" value={coDob} />
            <Field label="Social Security Number" value={coSsn} />
            <Field label="Driver's License" value={
              app.co_dl_number
                ? `${app.co_dl_number}${app.co_dl_state ? ` (${app.co_dl_state})` : ""}`
                : null
            } />
            <Field label="Employer" value={app.co_employer} />
            <Field label="Position" value={app.co_position} />
            <Field label="Time on Job" value={app.co_time_on_job} />
            <Field label="Work Phone" value={app.co_work_phone} />
            <Field label="Gross Monthly Income" value={formatCurrency(app.co_gross_monthly_income_cents)} />
            <Field label="Other Income" value={formatCurrency(app.co_other_income_cents)} />
          </>
        )}

        {(app.trade_in_year || app.trade_in_make || app.trade_in_model) && (
          <>
            <h2 className="text-lg font-bold border-b border-charcoal/20 mb-2 mt-4">
              Trade-In
            </h2>
            <Field
              label="Unit"
              value={[app.trade_in_year, app.trade_in_make, app.trade_in_model].filter(Boolean).join(" ")}
            />
            <Field label="Payoff Amount" value={formatCurrency(app.trade_in_payoff_cents)} />
            <Field label="Lienholder" value={app.trade_in_lienholder} />
          </>
        )}

        <h2 className="text-lg font-bold border-b border-charcoal/20 mb-2 mt-4">
          Down Payment
        </h2>
        <Field label="Amount" value={formatCurrency(app.down_payment_cents)} />

        <h2 className="text-lg font-bold border-b border-charcoal/20 mb-2 mt-4">
          Authorization
        </h2>
        <p className="mt-2 leading-relaxed">
          I certify the above information is complete and accurate, and I
          authorize the dealer to obtain consumer credit reports and verify
          the information provided in connection with this application.
        </p>
        <Field label="Signature" value={app.signature_name} />
        <Field label="Date" value={app.signature_date} />
      </div>
    </div>
  );
}
