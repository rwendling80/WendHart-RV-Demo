"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieValue,
  checkAdminPassword,
} from "@/lib/adminAuth";
import { getCurrentDealerId } from "@/lib/dealer";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const dealerId = await getCurrentDealerId();
  const { data: dealer, error } = await supabaseAdmin
    .from("dealers")
    .select("id, admin_password")
    .eq("id", dealerId)
    .single();
  if (error) throw error;

  if (!checkAdminPassword(dealer.admin_password, password)) {
    redirect("/admin/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(
    ADMIN_SESSION_COOKIE,
    adminSessionCookieValue(dealer.id, dealer.admin_password),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    }
  );

  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}
