import { headers } from "next/headers";
import { supabasePublic } from "@/lib/supabase/client";

export type Dealer = {
  id: string;
  slug: string;
  domain: string | null;
  name: string;
  tagline: string | null;
  phone: string | null;
  address: string | null;
  hours: { days: string; time: string }[];
  admin_password: string;
};

export const DEALER_ID_HEADER = "x-dealer-id";
export const DEALER_SLUG_HEADER = "x-dealer-slug";

// Reads the dealer resolved by proxy.ts (from the request's Host header) and
// fetches the full dealer row. Use this in Server Components/Actions instead
// of re-parsing the host — proxy.ts is the single place tenant resolution
// happens.
export async function getCurrentDealer(): Promise<Dealer> {
  const headerList = await headers();
  const dealerId = headerList.get(DEALER_ID_HEADER);

  if (!dealerId) {
    throw new Error(
      "No dealer resolved for this request — proxy.ts should always set x-dealer-id."
    );
  }

  const { data, error } = await supabasePublic
    .from("dealers")
    .select("*")
    .eq("id", dealerId)
    .single();

  if (error) throw error;
  return data as Dealer;
}

export function dealerPhoneHref(phone: string | null): string {
  if (!phone) return "tel:";
  return `tel:+1${phone.replace(/\D/g, "")}`;
}

export function dealerMapUrl(address: string | null): string {
  if (!address) return "#";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;
}

export async function getCurrentDealerId(): Promise<string> {
  const headerList = await headers();
  const dealerId = headerList.get(DEALER_ID_HEADER);
  if (!dealerId) {
    throw new Error(
      "No dealer resolved for this request — proxy.ts should always set x-dealer-id."
    );
  }
  return dealerId;
}
