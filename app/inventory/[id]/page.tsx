import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchUnitById, formatPrice, isVisible } from "@/lib/units";
import { SpecTable } from "@/components/SpecTable";
import { InquiryForm } from "@/components/InquiryForm";
import { getCurrentDealerId } from "@/lib/dealer";

export default async function UnitDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ inquiry?: string }>;
}) {
  const { id } = await params;
  const { inquiry } = await searchParams;
  const dealerId = await getCurrentDealerId();
  const unit = await fetchUnitById(dealerId, id);

  if (!unit || !isVisible(unit)) notFound();

  const photos = [...unit.unit_photos].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return a.sort_order - b.sort_order;
  });
  const sold = unit.status === "sold";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-[4/3] bg-charcoal/5 rounded-lg overflow-hidden">
            {photos[0] ? (
              <Image
                src={photos[0].url}
                alt={`${unit.year} ${unit.make} ${unit.model}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-charcoal-light">
                No photo yet
              </div>
            )}
            {sold && (
              <div className="absolute top-4 left-4 rounded bg-rust px-4 py-1.5 text-base font-extrabold uppercase tracking-wider text-white">
                Sold
              </div>
            )}
          </div>
          {photos.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
              {photos.slice(1).map((p) => (
                <div
                  key={p.id}
                  className="relative h-24 w-32 flex-none rounded overflow-hidden bg-charcoal/5"
                >
                  <Image
                    src={p.url}
                    alt=""
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal">
            {unit.year} {unit.make} {unit.model}
          </h1>
          <p className="mt-2 text-3xl font-extrabold text-forest-dark">
            {formatPrice(unit.price_cents)}
          </p>

          {unit.condition_notes && (
            <div className="mt-6">
              <h2 className="text-xl font-bold text-charcoal mb-2">
                Condition Notes
              </h2>
              <p className="text-lg leading-relaxed">
                {unit.condition_notes}
              </p>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-xl font-bold text-charcoal mb-2">
              Specifications
            </h2>
            <SpecTable category={unit.category} specs={unit.specs} />
          </div>
        </div>
      </div>

      <div className="mt-10 max-w-xl">
        <InquiryForm unitId={unit.id} status={inquiry} />
      </div>
    </div>
  );
}
