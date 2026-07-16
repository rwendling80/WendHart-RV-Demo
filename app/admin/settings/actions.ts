"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getCurrentDealerId } from "@/lib/dealer";

export async function updateChatbotSettings(formData: FormData) {
  const dealerId = await getCurrentDealerId();

  const warrantyType = String(formData.get("warranty_type") || "as_is");
  const yearsRaw = formData.get("years_in_business");

  const { error } = await supabaseAdmin
    .from("dealers")
    .update({
      owner_name: String(formData.get("owner_name") || "") || null,
      years_in_business: yearsRaw ? Number(yearsRaw) : null,
      vehicle_type: String(formData.get("vehicle_type") || "RV") || "RV",
      hold_policy: String(formData.get("hold_policy") || "") || null,
      trade_policy: String(formData.get("trade_policy") || "") || null,
      delivery_policy: String(formData.get("delivery_policy") || "") || null,
      warranty_type: warrantyType === "warranty" ? "warranty" : "as_is",
      warranty_details: String(formData.get("warranty_details") || "") || null,
      discovery_notes: String(formData.get("discovery_notes") || "") || null,
      notification_email: String(formData.get("notification_email") || "") || null,
    })
    .eq("id", dealerId);

  if (error) throw error;

  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}
