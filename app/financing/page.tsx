import { fetchVisibleUnits } from "@/lib/units";
import { getCurrentDealerId } from "@/lib/dealer";
import { FinancingForm } from "@/components/FinancingForm";

export default async function FinancingPage({
  searchParams,
}: {
  searchParams: Promise<{ unit?: string; sent?: string; error?: string }>;
}) {
  const params = await searchParams;
  const dealerId = await getCurrentDealerId();
  const units = await fetchVisibleUnits(dealerId);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 rounded-lg bg-rust px-4 py-3 text-center font-bold text-white">
        DEMO — do not enter real personal information. Use fictional details
        to test.
      </div>

      <h1 className="text-4xl font-extrabold text-forest-dark mb-2">
        Apply for Financing
      </h1>
      <p className="text-lg text-charcoal-light mb-8">
        Fill out the form below and we&apos;ll follow up to get you approved.
      </p>

      {params.sent === "1" ? (
        <div className="rounded-lg border-2 border-forest bg-forest/5 p-6">
          <h2 className="text-xl font-bold text-forest-dark">
            Application Received
          </h2>
          <p className="mt-2 text-lg">
            Thanks — we&apos;ve got your application. Someone from our team
            will be in touch soon.
          </p>
        </div>
      ) : (
        <>
          {params.error === "missing_fields" && (
            <p className="mb-6 rounded bg-rust/10 px-4 py-3 font-semibold text-rust">
              Please fill in all required fields (marked *), including a
              valid 9-digit Social Security Number.
            </p>
          )}
          <FinancingForm units={units} defaultUnitId={params.unit} />
        </>
      )}
    </div>
  );
}
