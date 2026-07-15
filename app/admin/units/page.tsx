import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import { formatPrice, primaryPhoto, type AdminUnit } from "@/lib/units";
import { getCurrentDealerId } from "@/lib/dealer";
import { UnitRowActions } from "@/components/admin/UnitRowActions";

export default async function AdminUnitsPage() {
  const dealerId = await getCurrentDealerId();
  const { data, error } = await supabaseAdmin
    .from("units")
    .select("*, unit_photos(*)")
    .eq("dealer_id", dealerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  const units = data as AdminUnit[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-3xl font-extrabold text-forest-dark">
          My Inventory
        </h1>
        <Link
          href="/admin/units/new"
          className="rounded-md bg-forest px-5 py-3 text-lg font-bold text-cream hover:bg-forest-dark"
        >
          + Add a Unit
        </Link>
      </div>

      <div className="space-y-3">
        {units.map((unit) => {
          const photo = primaryPhoto(unit);
          return (
            <div
              key={unit.id}
              className="flex flex-wrap items-center gap-4 rounded-lg border-2 border-charcoal/10 bg-white p-4"
            >
              <div className="h-16 w-20 flex-none rounded bg-charcoal/5 overflow-hidden">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photo} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>

              <UnitRowActions
                unitId={unit.id}
                status={unit.status}
                title={`${unit.year ?? ""} ${unit.make ?? ""} ${unit.model ?? ""}`.trim()}
                priceLabel={formatPrice(unit.price_cents)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
