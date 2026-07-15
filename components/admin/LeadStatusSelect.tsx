"use client";

import { updateLeadStatus } from "@/app/admin/leads/actions";

const STATUSES = ["New", "Contacted", "Came in", "Bought", "Dead"];

export function LeadStatusSelect({
  leadId,
  status,
}: {
  leadId: string;
  status: string;
}) {
  const action = updateLeadStatus.bind(null, leadId);

  return (
    <form action={action}>
      <select
        name="status"
        defaultValue={status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded border-2 border-charcoal/20 px-3 py-2.5 text-base font-semibold"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </form>
  );
}
