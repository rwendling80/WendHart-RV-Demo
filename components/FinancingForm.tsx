"use client";

import { useState } from "react";
import { submitFinancingApplication } from "@/app/financing/actions";

type UnitOption = {
  id: string;
  year: number | null;
  make: string | null;
  model: string | null;
};

const inputClass =
  "rounded border-2 border-charcoal/20 px-3 py-2 text-base";
const labelClass = "flex flex-col gap-1 text-sm font-semibold";

function PersonFields({ prefix }: { prefix: "applicant" | "co" }) {
  const required = prefix === "applicant";
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className={`${labelClass} sm:col-span-2`}>
        Full Name{required && " *"}
        <input type="text" name={`${prefix}_name`} required={required} className={inputClass} />
      </label>
      <label className={`${labelClass} sm:col-span-2`}>
        Address{required && " *"}
        <input type="text" name={`${prefix}_address`} required={required} className={inputClass} />
      </label>
      <label className={labelClass}>
        Time at Address
        <input type="text" name={`${prefix}_time_at_address`} placeholder="e.g. 3 years" className={inputClass} />
      </label>
      <label className={labelClass}>
        Housing Status
        <select name={`${prefix}_housing_status`} className={inputClass} defaultValue="">
          <option value="">Select</option>
          <option value="own">Own</option>
          <option value="rent">Rent</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label className={labelClass}>
        Monthly Housing Payment
        <input type="number" name={`${prefix}_housing_payment`} placeholder="$" className={inputClass} />
      </label>
      <label className={labelClass}>
        Phone{required && " *"}
        <input type="tel" name={`${prefix}_phone`} required={required} className={inputClass} />
      </label>
      <label className={labelClass}>
        Email
        <input type="email" name={`${prefix}_email`} className={inputClass} />
      </label>
      <label className={labelClass}>
        Date of Birth{required && " *"}
        <input type="date" name={`${prefix}_dob`} required={required} className={inputClass} />
      </label>
      <label className={labelClass}>
        Social Security Number{required && " *"}
        <input
          type="text"
          name={`${prefix}_ssn`}
          required={required}
          placeholder="123-45-6789"
          inputMode="numeric"
          className={inputClass}
        />
      </label>
      <label className={labelClass}>
        Driver&apos;s License Number
        <input type="text" name={`${prefix}_dl_number`} className={inputClass} />
      </label>
      <label className={labelClass}>
        Driver&apos;s License State
        <input type="text" name={`${prefix}_dl_state`} maxLength={2} placeholder="e.g. TN" className={inputClass} />
      </label>
      <label className={labelClass}>
        Employer{required && " *"}
        <input type="text" name={`${prefix}_employer`} required={required} className={inputClass} />
      </label>
      <label className={labelClass}>
        Position
        <input type="text" name={`${prefix}_position`} className={inputClass} />
      </label>
      <label className={labelClass}>
        Time on Job
        <input type="text" name={`${prefix}_time_on_job`} placeholder="e.g. 2 years" className={inputClass} />
      </label>
      <label className={labelClass}>
        Work Phone
        <input type="tel" name={`${prefix}_work_phone`} className={inputClass} />
      </label>
      <label className={labelClass}>
        Gross Monthly Income{required && " *"}
        <input
          type="number"
          name={`${prefix}_gross_monthly_income`}
          required={required}
          placeholder="$"
          className={inputClass}
        />
      </label>
      <label className={labelClass}>
        Other Income (optional)
        <input type="number" name={`${prefix}_other_income`} placeholder="$" className={inputClass} />
        <span className="text-xs font-normal text-charcoal-light">
          Alimony/child support need not be disclosed unless you wish it
          considered.
        </span>
      </label>
    </div>
  );
}

export function FinancingForm({
  units,
  defaultUnitId,
}: {
  units: UnitOption[];
  defaultUnitId?: string;
}) {
  const [showCoapplicant, setShowCoapplicant] = useState(false);
  const [showTradeIn, setShowTradeIn] = useState(false);

  return (
    <form action={submitFinancingApplication} className="space-y-8 max-w-3xl">
      <section className="rounded-lg border-2 border-charcoal/10 bg-white p-5">
        <h2 className="text-xl font-bold text-charcoal mb-4">
          Unit of Interest
        </h2>
        <label className={labelClass}>
          Which unit are you interested in?
          <select name="unit_id" defaultValue={defaultUnitId ?? ""} className={inputClass}>
            <option value="">Not sure yet</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.year} {u.make} {u.model}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="rounded-lg border-2 border-charcoal/10 bg-white p-5">
        <h2 className="text-xl font-bold text-charcoal mb-4">
          Applicant Information
        </h2>
        <PersonFields prefix="applicant" />
      </section>

      <section className="rounded-lg border-2 border-charcoal/10 bg-white p-5">
        <label className="flex items-center gap-2 text-base font-bold text-charcoal">
          <input
            type="checkbox"
            name="has_coapplicant"
            checked={showCoapplicant}
            onChange={(e) => setShowCoapplicant(e.target.checked)}
          />
          Add a Co-Applicant
        </label>
        {showCoapplicant && (
          <div className="mt-4">
            <PersonFields prefix="co" />
          </div>
        )}
      </section>

      <section className="rounded-lg border-2 border-charcoal/10 bg-white p-5">
        <label className="flex items-center gap-2 text-base font-bold text-charcoal">
          <input
            type="checkbox"
            checked={showTradeIn}
            onChange={(e) => setShowTradeIn(e.target.checked)}
          />
          I Have a Trade-In
        </label>
        {showTradeIn && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              Year
              <input type="number" name="trade_in_year" className={inputClass} />
            </label>
            <label className={labelClass}>
              Make
              <input type="text" name="trade_in_make" className={inputClass} />
            </label>
            <label className={labelClass}>
              Model
              <input type="text" name="trade_in_model" className={inputClass} />
            </label>
            <label className={labelClass}>
              Payoff Amount
              <input type="number" name="trade_in_payoff" placeholder="$" className={inputClass} />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              Lienholder
              <input type="text" name="trade_in_lienholder" className={inputClass} />
            </label>
          </div>
        )}
      </section>

      <section className="rounded-lg border-2 border-charcoal/10 bg-white p-5">
        <h2 className="text-xl font-bold text-charcoal mb-4">Down Payment</h2>
        <label className={labelClass}>
          Down Payment Amount
          <input type="number" name="down_payment" placeholder="$" className={inputClass} />
        </label>
      </section>

      <section className="rounded-lg border-2 border-charcoal/10 bg-white p-5">
        <h2 className="text-xl font-bold text-charcoal mb-4">
          Authorization
        </h2>
        <p className="text-base leading-relaxed mb-4">
          I certify the above information is complete and accurate, and I
          authorize the dealer to obtain consumer credit reports and verify
          the information provided in connection with this application.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Typed Name (Signature) *
            <input type="text" name="signature_name" required className={inputClass} />
          </label>
          <label className={labelClass}>
            Date *
            <input type="date" name="signature_date" required className={inputClass} />
          </label>
        </div>
      </section>

      <button
        type="submit"
        className="w-full rounded-md bg-forest px-6 py-4 text-lg font-bold text-cream hover:bg-forest-dark"
      >
        Submit Application
      </button>
    </form>
  );
}
