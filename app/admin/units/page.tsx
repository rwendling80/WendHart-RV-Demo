import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import { formatPrice, primaryPhoto, type Unit } from "@/lib/units";
import { markSold, markAvailable, deleteUnit } from "./actions";

export default async function AdminUnitsPage() {
  const { data, error } = await supabaseAdmin
    .from("units")
    .select("*, unit_photos(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  const units = data as Unit[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-forest-dark">
          Inventory
        </h1>
        <Link
          href="/admin/units/new"
          className="rounded-md bg-forest px-5 py-2.5 font-bold text-cream hover:bg-forest-dark"
        >
          + Add Unit
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

              <div className="flex-1 min-w-[200px]">
                <p className="font-bold text-charcoal">
                  {unit.year} {unit.make} {unit.model}
                </p>
                <p className="text-sm text-charcoal-light">
                  {formatPrice(unit.price_cents)} ·{" "}
                  <span
                    className={
                      unit.status === "sold" ? "text-rust font-bold" : ""
                    }
                  >
                    {unit.status === "sold" ? "SOLD" : "Available"}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/units/${unit.id}/edit`}
                  className="rounded border-2 border-charcoal/20 px-3 py-1.5 text-sm font-semibold hover:bg-charcoal/5"
                >
                  Edit
                </Link>
                {unit.status === "available" ? (
                  <form action={markSold.bind(null, unit.id)}>
                    <button
                      type="submit"
                      className="rounded border-2 border-rust px-3 py-1.5 text-sm font-semibold text-rust hover:bg-rust/10"
                    >
                      Mark Sold
                    </button>
                  </form>
                ) : (
                  <form action={markAvailable.bind(null, unit.id)}>
                    <button
                      type="submit"
                      className="rounded border-2 border-forest px-3 py-1.5 text-sm font-semibold text-forest hover:bg-forest/10"
                    >
                      Mark Available
                    </button>
                  </form>
                )}
                <form action={deleteUnit.bind(null, unit.id)}>
                  <button
                    type="submit"
                    className="rounded border-2 border-charcoal/20 px-3 py-1.5 text-sm font-semibold hover:bg-charcoal/5"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
