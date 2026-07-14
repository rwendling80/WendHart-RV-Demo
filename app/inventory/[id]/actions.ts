"use server";

import { redirect } from "next/navigation";
import { supabasePublic } from "@/lib/supabase/client";

export async function submitInquiry(unitId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !phone) {
    redirect(`/inventory/${unitId}?inquiry=error`);
  }

  const { error } = await supabasePublic.from("leads").insert({
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
