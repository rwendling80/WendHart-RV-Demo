"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getCurrentDealerId } from "@/lib/dealer";
import { FINANCING_STATUSES } from "@/lib/financing";

export async function updateFinancingStatus(
  applicationId: string,
  formData: FormData
) {
  const status = String(formData.get("status") || "");
  if (!FINANCING_STATUSES.includes(status as (typeof FINANCING_STATUSES)[number]))
    return;

  const dealerId = await getCurrentDealerId();
  const { error } = await supabaseAdmin
    .from("financing_applications")
    .update({ status })
    .eq("id", applicationId)
    .eq("dealer_id", dealerId);

  if (error) throw error;

  revalidatePath("/admin/financing");
}
