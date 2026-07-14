import Image from "next/image";
import Link from "next/link";
import { Unit, formatPrice, primaryPhoto, isVisible } from "@/lib/units";
import { unitTypeOptions } from "@/lib/categorySpecs";

function typeLabel(unit: Unit): string | null {
  const options = unitTypeOptions[unit.category] ?? [];
  return options.find((o) => o.value === unit.rv_type)?.label ?? null;
}

export function UnitCard({ unit }: { unit: Unit }) {
  const photo = primaryPhoto(unit);
  const sold = unit.status === "sold" && isVisible(unit);
  const length = unit.specs?.length_ft;
  const sleeps = unit.specs?.sleeps;

  return (
    <Link
      href={`/inventory/${unit.id}`}
      className="block rounded-lg border-2 border-charcoal/10 bg-white overflow-hidden hover:border-forest transition-colors"
    >
      <div className="relative aspect-[4/3] bg-charcoal/5">
        {photo ? (
          <Image
            src={photo}
            alt={`${unit.year ?? ""} ${unit.make ?? ""} ${unit.model ?? ""}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-charcoal-light">
            No photo yet
          </div>
        )}
        {sold && (
          <div className="absolute top-3 left-3 rounded bg-rust px-3 py-1 text-sm font-extrabold uppercase tracking-wider text-white">
            Sold
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-charcoal">
          {unit.year} {unit.make} {unit.model}
        </h3>
        {typeLabel(unit) && (
          <p className="text-sm text-charcoal-light">{typeLabel(unit)}</p>
        )}
        <div className="mt-2 flex gap-4 text-base text-charcoal-light">
          {length != null && <span>{String(length)} ft</span>}
          {sleeps != null && <span>Sleeps {String(sleeps)}</span>}
        </div>
        <p className="mt-3 text-2xl font-extrabold text-forest-dark">
          {formatPrice(unit.price_cents)}
        </p>
      </div>
    </Link>
  );
}
