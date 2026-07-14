"use client";

import { updateFinancingStatus } from "@/app/admin/financing/actions";
import { FINANCING_STATUSES } from "@/lib/financing";

export function FinancingStatusSelect({
  applicationId,
  status,
}: {
  applicationId: string;
  status: string;
}) {
  const action = updateFinancingStatus.bind(null, applicationId);

  return (
    <form action={action}>
      <select
        name="status"
        defaultValue={status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded border-2 border-charcoal/20 px-2 py-1 text-sm font-semibold"
      >
        {FINANCING_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </form>
  );
}
