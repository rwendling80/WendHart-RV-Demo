"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { categorySpecFields } from "@/lib/categorySpecs";
import { getCurrentDealerId } from "@/lib/dealer";
import { generateDescription } from "@/lib/generateDescription";

function buildSpecsFromForm(category: string, formData: FormData) {
  const fields = categorySpecFields[category] ?? [];
  const specs: Record<string, unknown> = {};
  for (const field of fields) {
    const raw = formData.get(`spec_${field.key}`);
    if (raw == null || raw === "") continue;
    if (field.key === "generator") {
      specs[field.key] = raw === "on" || raw === "true";
    } else {
      const num = Number(raw);
      specs[field.key] = Number.isNaN(num) ? raw : num;
    }
  }
  return specs;
}

function resolveDescription(formData: FormData, specs: Record<string, unknown>) {
  const typed = String(formData.get("description") || "").trim();
  if (typed) return typed;

  return generateDescription({
    year: formData.get("year") ? Number(formData.get("year")) : null,
    make: String(formData.get("make") || "") || null,
    model: String(formData.get("model") || "") || null,
    rvType: String(formData.get("rv_type") || "") || null,
    sleeps: specs.sleeps as number | undefined,
    lengthFt: specs.length_ft as number | undefined,
    mileage: specs.mileage as number | undefined,
    hasGenerator: Boolean(specs.generator),
  });
}

async function uploadPhotos(
  dealerId: string,
  unitId: string,
  formData: FormData
) {
  const files = formData.getAll("photos").filter(
    (f): f is File => f instanceof File && f.size > 0
  );

  const { data: existing } = await supabaseAdmin
    .from("unit_photos")
    .select("id")
    .eq("unit_id", unitId)
    .eq("dealer_id", dealerId);
  const nextSortStart = existing?.length ?? 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${dealerId}/${unitId}/${randomUUID()}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("unit-photos")
      .upload(path, file, { contentType: file.type });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("unit-photos").getPublicUrl(path);

    await supabaseAdmin.from("unit_photos").insert({
      dealer_id: dealerId,
      unit_id: unitId,
      url: publicUrl,
      sort_order: nextSortStart + i,
      is_primary: nextSortStart === 0 && i === 0,
    });
  }
}

export async function createUnit(formData: FormData) {
  const dealerId = await getCurrentDealerId();
  const vin = String(formData.get("vin") || "").trim();
  const price = Number(formData.get("price") || 0);
  const floorPrice = formData.get("floor_price");
  const photoFiles = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (!vin) redirect("/admin/units/new?error=missing_vin");
  if (!price || price <= 0) redirect("/admin/units/new?error=missing_price");
  if (!floorPrice || Number(floorPrice) <= 0)
    redirect("/admin/units/new?error=missing_floor_price");
  if (photoFiles.length === 0) redirect("/admin/units/new?error=missing_photo");

  const category = "rv";
  const specs = buildSpecsFromForm(category, formData);
  const description = resolveDescription(formData, specs);

  const { data, error } = await supabaseAdmin
    .from("units")
    .insert({
      dealer_id: dealerId,
      category,
      rv_type: String(formData.get("rv_type") || "") || null,
      vin,
      year: formData.get("year") ? Number(formData.get("year")) : null,
      make: String(formData.get("make") || "") || null,
      model: String(formData.get("model") || "") || null,
      price_cents: Math.round(price * 100),
      // Dealer's bottom-dollar. ADMIN-ONLY -- see the column comment and
      // grants in supabase/migration_floor_price.sql. This is chatbot-triage
      // data for Phase 2 (flag a hot offer), never a quote/acceptance source,
      // and it must never be threaded into `description` or any public query.
      floor_price_cents: Math.round(Number(floorPrice) * 100),
      condition_notes: String(formData.get("condition_notes") || "") || null,
      description,
      specs,
    })
    .select("id")
    .single();

  if (error) throw error;

  await uploadPhotos(dealerId, data.id, formData);

  revalidatePath("/admin/units");
  revalidatePath("/inventory");
  redirect("/admin/units");
}

export async function updateUnit(unitId: string, formData: FormData) {
  const dealerId = await getCurrentDealerId();
  const vin = String(formData.get("vin") || "").trim();
  const price = Number(formData.get("price") || 0);
  const floorPrice = formData.get("floor_price");

  if (!vin) redirect(`/admin/units/${unitId}/edit?error=missing_vin`);
  if (!price || price <= 0)
    redirect(`/admin/units/${unitId}/edit?error=missing_price`);

  const category = "rv";
  const specs = buildSpecsFromForm(category, formData);
  const description = resolveDescription(formData, specs);

  const { error } = await supabaseAdmin
    .from("units")
    .update({
      rv_type: String(formData.get("rv_type") || "") || null,
      vin,
      year: formData.get("year") ? Number(formData.get("year")) : null,
      make: String(formData.get("make") || "") || null,
      model: String(formData.get("model") || "") || null,
      price_cents: Math.round(price * 100),
      floor_price_cents:
        floorPrice && Number(floorPrice) > 0
          ? Math.round(Number(floorPrice) * 100)
          : null,
      condition_notes: String(formData.get("condition_notes") || "") || null,
      description,
      specs,
      updated_at: new Date().toISOString(),
    })
    .eq("id", unitId)
    .eq("dealer_id", dealerId);

  if (error) throw error;

  await uploadPhotos(dealerId, unitId, formData);

  revalidatePath("/admin/units");
  revalidatePath(`/inventory/${unitId}`);
  revalidatePath("/inventory");
  redirect("/admin/units");
}

export async function markSold(unitId: string) {
  const dealerId = await getCurrentDealerId();
  const { error } = await supabaseAdmin
    .from("units")
    .update({ status: "sold", sold_at: new Date().toISOString() })
    .eq("id", unitId)
    .eq("dealer_id", dealerId);

  if (error) throw error;

  revalidatePath("/admin/units");
  revalidatePath("/inventory");
}

export async function markAvailable(unitId: string) {
  const dealerId = await getCurrentDealerId();
  const { error } = await supabaseAdmin
    .from("units")
    .update({ status: "available", sold_at: null })
    .eq("id", unitId)
    .eq("dealer_id", dealerId);

  if (error) throw error;

  revalidatePath("/admin/units");
  revalidatePath("/inventory");
}

export async function deleteUnit(unitId: string) {
  const dealerId = await getCurrentDealerId();
  const { error } = await supabaseAdmin
    .from("units")
    .delete()
    .eq("id", unitId)
    .eq("dealer_id", dealerId);
  if (error) throw error;

  revalidatePath("/admin/units");
  revalidatePath("/inventory");
}

export async function deletePhoto(photoId: string, unitId: string) {
  const dealerId = await getCurrentDealerId();
  const { error } = await supabaseAdmin
    .from("unit_photos")
    .delete()
    .eq("id", photoId)
    .eq("dealer_id", dealerId);
  if (error) throw error;

  revalidatePath(`/admin/units/${unitId}/edit`);
  revalidatePath(`/inventory/${unitId}`);
}
