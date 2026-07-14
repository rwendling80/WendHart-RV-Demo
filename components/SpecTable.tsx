import { categorySpecFields } from "@/lib/categorySpecs";

export function SpecTable({
  category,
  specs,
}: {
  category: string;
  specs: Record<string, unknown>;
}) {
  const fields = categorySpecFields[category] ?? [];
  const rows = fields.filter((f) => specs?.[f.key] != null);

  if (rows.length === 0) return null;

  return (
    <table className="w-full text-left text-lg">
      <tbody>
        {rows.map((field) => {
          const raw = specs[field.key];
          const value = field.format
            ? field.format(raw)
            : `${String(raw)}${field.unit ? ` ${field.unit}` : ""}`;
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
