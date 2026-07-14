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
  }>;
}) {
  const params = await searchParams;
  const dealerId = await getCurrentDealerId();

  const units = await fetchVisibleUnits(dealerId, {
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    rvType: params.type || undefined,
    minSleeps: params.minSleeps ? Number(params.minSleeps) : undefined,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-extrabold text-forest-dark mb-6">
        Inventory
      </h1>

      <InventoryFilterForm searchParams={params} />

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
