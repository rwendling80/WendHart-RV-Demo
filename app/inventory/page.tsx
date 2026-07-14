import Link from "next/link";
import { fetchVisibleUnits } from "@/lib/units";
import { UnitCard } from "@/components/UnitCard";
import { InventoryFilterForm } from "@/components/InventoryFilterForm";
import { getCurrentDealerId } from "@/lib/dealer";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{
    minPrice?: string;
    maxPrice?: string;
    type?: string;
    minSleeps?: string;
    minYear?: string;
    maxYear?: string;
  }>;
}) {
  const params = await searchParams;
  const dealerId = await getCurrentDealerId();

  const units = await fetchVisibleUnits(dealerId, {
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    rvType: params.type || undefined,
    minSleeps: params.minSleeps ? Number(params.minSleeps) : undefined,
    minYear: params.minYear ? Number(params.minYear) : undefined,
    maxYear: params.maxYear ? Number(params.maxYear) : undefined,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-extrabold text-forest-dark mb-6">
        Inventory
      </h1>

      <InventoryFilterForm searchParams={params} />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-forest/5 border-2 border-forest/20 px-5 py-4">
        <p className="text-lg font-semibold text-forest-dark">
          Found something you like? Get pre-approved before you visit.
        </p>
        <Link
          href="/financing"
          className="rounded-md bg-forest px-5 py-2.5 text-base font-bold text-cream hover:bg-forest-dark"
        >
          Apply for Financing
        </Link>
      </div>

      {units.length === 0 ? (
        <p className="text-lg text-charcoal-light">
          No units match those filters right now. Try clearing them or check
          back soon.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {units.map((unit) => (
            <UnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      )}
    </div>
  );
}
