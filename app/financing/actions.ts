"use server";

import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getCurrentDealerId } from "@/lib/dealer";
import { encrypt } from "@/lib/financeCrypto";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function centsFromDollars(formData: FormData, key: string): number | null {
  const raw = str(formData, key);
  if (!raw) return null;
  const num = Number(raw);
  return Number.isFinite(num) ? Math.round(num * 100) : null;
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export async function submitFinancingApplication(formData: FormData) {
  const dealerId = await getCurrentDealerId();

  const applicantName = str(formData, "applicant_name");
  const applicantAddress = str(formData, "applicant_address");
  const applicantPhone = str(formData, "applicant_phone");
  const applicantDob = str(formData, "applicant_dob");
  const applicantSsn = digitsOnly(str(formData, "applicant_ssn"));
  const applicantEmployer = str(formData, "applicant_employer");
  const applicantIncome = centsFromDollars(
    formData,
    "applicant_gross_monthly_income"
  );
  const signatureName = str(formData, "signature_name");
  const signatureDate = str(formData, "signature_date");

  const unitId = str(formData, "unit_id") || null;

  if (
    !applicantName ||
    !applicantAddress ||
    !applicantPhone ||
    !applicantDob ||
    applicantSsn.length !== 9 ||
    !applicantEmployer ||
    !applicantIncome ||
    !signatureName ||
    !signatureDate
  ) {
    const qs = new URLSearchParams({ error: "missing_fields" });
    if (unitId) qs.set("unit", unitId);
    redirect(`/financing?${qs.toString()}`);
  }

  const hasCoapplicant = formData.get("has_coapplicant") === "on";

  const record: Record<string, unknown> = {
    dealer_id: dealerId,
    unit_id: unitId,
    status: "New",

    applicant_name: applicantName,
    applicant_address: applicantAddress,
    applicant_time_at_address: str(formData, "applicant_time_at_address") || null,
    applicant_housing_status: str(formData, "applicant_housing_status") || null,
    applicant_housing_payment_cents: centsFromDollars(formData, "applicant_housing_payment"),
    applicant_phone: applicantPhone,
    applicant_email: str(formData, "applicant_email") || null,
    applicant_dob_encrypted: encrypt(applicantDob),
    applicant_ssn_encrypted: encrypt(applicantSsn),
    applicant_ssn_last4: applicantSsn.slice(-4),
    applicant_dl_number: str(formData, "applicant_dl_number") || null,
    applicant_dl_state: str(formData, "applicant_dl_state") || null,
    applicant_employer: applicantEmployer,
    applicant_position: str(formData, "applicant_position") || null,
    applicant_time_on_job: str(formData, "applicant_time_on_job") || null,
    applicant_work_phone: str(formData, "applicant_work_phone") || null,
    applicant_gross_monthly_income_cents: applicantIncome,
    applicant_other_income_cents: centsFromDollars(formData, "applicant_other_income"),

    has_coapplicant: hasCoapplicant,
    down_payment_cents: centsFromDollars(formData, "down_payment"),
    signature_name: signatureName,
    signature_date: signatureDate,
  };

  if (hasCoapplicant) {
    const coSsn = digitsOnly(str(formData, "co_ssn"));
    Object.assign(record, {
      co_name: str(formData, "co_name") || null,
      co_address: str(formData, "co_address") || null,
      co_time_at_address: str(formData, "co_time_at_address") || null,
      co_housing_status: str(formData, "co_housing_status") || null,
      co_housing_payment_cents: centsFromDollars(formData, "co_housing_payment"),
      co_phone: str(formData, "co_phone") || null,
      co_email: str(formData, "co_email") || null,
      co_dob_encrypted: str(formData, "co_dob") ? encrypt(str(formData, "co_dob")) : null,
      co_ssn_encrypted: coSsn.length === 9 ? encrypt(coSsn) : null,
      co_ssn_last4: coSsn.length === 9 ? coSsn.slice(-4) : null,
      co_dl_number: str(formData, "co_dl_number") || null,
      co_dl_state: str(formData, "co_dl_state") || null,
      co_employer: str(formData, "co_employer") || null,
      co_position: str(formData, "co_position") || null,
      co_time_on_job: str(formData, "co_time_on_job") || null,
      co_work_phone: str(formData, "co_work_phone") || null,
      co_gross_monthly_income_cents: centsFromDollars(formData, "co_gross_monthly_income"),
      co_other_income_cents: centsFromDollars(formData, "co_other_income"),
    });
  }

  const tradeInYear = str(formData, "trade_in_year");
  if (tradeInYear || str(formData, "trade_in_make") || str(formData, "trade_in_model")) {
    Object.assign(record, {
      trade_in_year: tradeInYear ? Number(tradeInYear) : null,
      trade_in_make: str(formData, "trade_in_make") || null,
      trade_in_model: str(formData, "trade_in_model") || null,
      trade_in_payoff_cents: centsFromDollars(formData, "trade_in_payoff"),
      trade_in_lienholder: str(formData, "trade_in_lienholder") || null,
    });
  }

  const { data: lead, error: leadError } = await supabaseAdmin
    .from("leads")
    .insert({
      dealer_id: dealerId,
      unit_id: unitId,
      name: applicantName,
      phone: applicantPhone,
      message: "Financing application submitted.",
      source: "financing",
    })
    .select("id")
    .single();

  if (leadError) throw leadError;

  record.lead_id = lead.id;

  const { error } = await supabaseAdmin.from("financing_applications").insert(record);
  if (error) throw error;

  redirect("/financing?sent=1");
}
