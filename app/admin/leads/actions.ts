"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";

const LEAD_STATUSES = ["New", "Contacted", "Came in", "Bought", "Dead"] as const;

export async function updateLeadStatus(leadId: string, formData: FormData) {
  const status = String(formData.get("status") || "");
  if (!LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number])) return;

  const { error } = await supabaseAdmin
    .from("leads")
    .update({ status })
    .eq("id", leadId);

  if (error) throw error;

  revalidatePath("/admin/leads");
}
