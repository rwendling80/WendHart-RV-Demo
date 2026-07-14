"use server";

import { redirect } from "next/navigation";
import { supabasePublic } from "@/lib/supabase/client";
import { getCurrentDealerId } from "@/lib/dealer";

export async function submitInquiry(unitId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !phone) {
    redirect(`/inventory/${unitId}?inquiry=error`);
  }

  const dealerId = await getCurrentDealerId();

  const { error } = await supabasePublic.from("leads").insert({
    dealer_id: dealerId,
    unit_id: unitId,
    name,
    phone,
    message: message || null,
  });

  if (error) {
    redirect(`/inventory/${unitId}?inquiry=error`);
  }

  redirect(`/inventory/${unitId}?inquiry=sent`);
}
