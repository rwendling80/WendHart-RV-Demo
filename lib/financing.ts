export const FINANCING_STATUSES = [
  "New",
  "Printed",
  "Submitted to lender",
  "Approved",
  "Declined",
  "Expired",
] as const;

export type FinancingStatus = (typeof FINANCING_STATUSES)[number];

export type FinancingApplication = {
  id: string;
  dealer_id: string;
  unit_id: string | null;
  lead_id: string | null;
  status: FinancingStatus;

  applicant_name: string;
  applicant_address: string;
  applicant_time_at_address: string | null;
  applicant_housing_status: "own" | "rent" | "other" | null;
  applicant_housing_payment_cents: number | null;
  applicant_phone: string;
  applicant_email: string | null;
  applicant_dob_encrypted: string;
  applicant_ssn_encrypted: string;
  applicant_ssn_last4: string;
  applicant_dl_number: string | null;
  applicant_dl_state: string | null;
  applicant_employer: string;
  applicant_position: string | null;
  applicant_time_on_job: string | null;
  applicant_work_phone: string | null;
  applicant_gross_monthly_income_cents: number;
  applicant_other_income_cents: number | null;

  has_coapplicant: boolean;
  co_name: string | null;
  co_address: string | null;
  co_time_at_address: string | null;
  co_housing_status: "own" | "rent" | "other" | null;
  co_housing_payment_cents: number | null;
  co_phone: string | null;
  co_email: string | null;
  co_dob_encrypted: string | null;
  co_ssn_encrypted: string | null;
  co_ssn_last4: string | null;
  co_dl_number: string | null;
  co_dl_state: string | null;
  co_employer: string | null;
  co_position: string | null;
  co_time_on_job: string | null;
  co_work_phone: string | null;
  co_gross_monthly_income_cents: number | null;
  co_other_income_cents: number | null;

  trade_in_year: number | null;
  trade_in_make: string | null;
  trade_in_model: string | null;
  trade_in_payoff_cents: number | null;
  trade_in_lienholder: string | null;

  down_payment_cents: number | null;
  signature_name: string;
  signature_date: string;
  created_at: string;

  units?: { year: number | null; make: string | null; model: string | null } | null;
};

export function maskSsn(last4: string): string {
  return `•••-••-${last4}`;
}

export function formatCurrency(cents: number | null): string {
  if (cents == null) return "—";
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
