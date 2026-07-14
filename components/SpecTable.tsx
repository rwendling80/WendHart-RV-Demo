import { categorySpecFields } from "@/lib/categorySpecs";

function defaultFormat(raw: unknown, unit?: string): string {
  const num = Number(raw);
  const display = Number.isFinite(num) && typeof raw !== "boolean"
    ? num.toLocaleString("en-US")
    : String(raw);
  return `${display}${unit ? ` ${unit}` : ""}`;
}

export function SpecTable({
  category,
  rvType,
  specs,
}: {
  category: string;
  rvType?: string | null;
  specs: Record<string, unknown>;
}) {
  const fields = categorySpecFields[category] ?? [];
  const rows = fields.filter((f) => {
    if (specs?.[f.key] == null) return false;
    if (f.showForTypes && (!rvType || !f.showForTypes.includes(rvType)))
      return false;
    return true;
  });

  if (rows.length === 0) return null;

  return (
    <table className="w-full text-left text-lg">
      <tbody>
        {rows.map((field) => {
          const raw = specs[field.key];
          const value = field.format
            ? field.format(raw)
            : defaultFormat(raw, field.unit);
          return (
            <tr key={field.key} className="border-b border-charcoal/10">
              <th className="py-2 pr-4 font-semibold text-charcoal-light w-1/2">
                {field.label}
              </th>
              <td className="py-2">{value}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
