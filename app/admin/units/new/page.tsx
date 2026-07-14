import { UnitForm } from "@/components/admin/UnitForm";
import { createUnit } from "../actions";

const errorMessages: Record<string, string> = {
  missing_vin: "VIN is required.",
  missing_price: "Price is required.",
  missing_photo: "At least one photo is required.",
};

export default async function NewUnitPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-forest-dark mb-2">
        Add Unit
      </h1>
      <p className="text-lg text-charcoal-light mb-6">
        Just VIN, price, and at least one photo are required — everything
        else is optional and can be filled in later.
      </p>
      {error && errorMessages[error] && (
        <p className="mb-6 rounded bg-rust/10 px-4 py-3 font-semibold text-rust">
          {errorMessages[error]}
        </p>
      )}
      <UnitForm action={createUnit} />
    </div>
  );
}
