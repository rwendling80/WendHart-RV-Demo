import { unitTypeOptions } from "@/lib/categorySpecs";

export function InventoryFilterForm({
  searchParams,
}: {
  searchParams: {
    minPrice?: string;
    maxPrice?: string;
    type?: string;
    minSleeps?: string;
    minYear?: string;
    maxYear?: string;
  };
}) {
  return (
    <form
      method="get"
      className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6 rounded-lg border-2 border-charcoal/10 bg-white p-4 mb-8"
    >
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Min Price
        <input
          type="number"
          name="minPrice"
          defaultValue={searchParams.minPrice ?? ""}
          placeholder="$0"
          className="rounded border-2 border-charcoal/20 px-3 py-2 text-base"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Max Price
        <input
          type="number"
          name="maxPrice"
          defaultValue={searchParams.maxPrice ?? ""}
          placeholder="Any"
          className="rounded border-2 border-charcoal/20 px-3 py-2 text-base"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Min Year
        <input
          type="number"
          name="minYear"
          defaultValue={searchParams.minYear ?? ""}
          placeholder="Any"
          className="rounded border-2 border-charcoal/20 px-3 py-2 text-base"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Max Year
        <input
          type="number"
          name="maxYear"
          defaultValue={searchParams.maxYear ?? ""}
          placeholder="Any"
          className="rounded border-2 border-charcoal/20 px-3 py-2 text-base"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Type
        <select
          name="type"
          defaultValue={searchParams.type ?? ""}
          className="rounded border-2 border-charcoal/20 px-3 py-2 text-base"
        >
          <option value="">Any Type</option>
          {unitTypeOptions.rv.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold">
        Min Sleeps
        <select
          name="minSleeps"
          defaultValue={searchParams.minSleeps ?? ""}
          className="rounded border-2 border-charcoal/20 px-3 py-2 text-base"
        >
          <option value="">Any</option>
          {[2, 4, 6, 8].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </select>
      </label>
      <div className="sm:col-span-3 lg:col-span-6 flex gap-3">
        <button
          type="submit"
          className="rounded-md bg-forest px-6 py-2 text-base font-bold text-cream hover:bg-forest-dark"
        >
          Apply Filters
        </button>
        <a
          href="/inventory"
          className="rounded-md border-2 border-charcoal/20 px-6 py-2 text-base font-bold hover:bg-charcoal/5"
        >
          Clear
        </a>
      </div>
    </form>
  );
}
