import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { Unit } from "@/lib/units";
import { UnitForm } from "@/components/admin/UnitForm";
import { updateUnit } from "../../actions";

const errorMessages: Record<string, string> = {
  missing_vin: "VIN is required.",
  missing_price: "Price is required.",
};

export default async function EditUnitPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error: errorParam } = await searchParams;

  const { data, error } = await supabaseAdmin
    .from("units")
    .select("*, unit_photos(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) notFound();

  const unit = data as Unit;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-forest-dark mb-6">
        Edit Unit
      </h1>
      {errorParam && errorMessages[errorParam] && (
        <p className="mb-6 rounded bg-rust/10 px-4 py-3 font-semibold text-rust">
          {errorMessages[errorParam]}
        </p>
      )}
      <UnitForm action={updateUnit.bind(null, unit.id)} unit={unit} />
    </div>
  );
}
