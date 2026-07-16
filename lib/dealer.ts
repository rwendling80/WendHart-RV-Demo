import { headers } from "next/headers";
import { supabasePublic } from "@/lib/supabase/client";

// Public-safe shape. Deliberately excludes admin_password and
// notification_email -- see PUBLIC_DEALER_COLUMNS and the column-level
// grants in supabase/migration_chatbot.sql for why that's not just a
// type-level convention (same pattern as Unit vs AdminUnit in lib/units.ts).
export type Dealer = {
  id: string;
  slug: string;
  domain: string | null;
  name: string;
  tagline: string | null;
  phone: string | null;
  address: string | null;
  hours: { days: string; time: string }[];
  owner_name: string | null;
  years_in_business: number | null;
  vehicle_type: string;
  hold_policy: string | null;
  trade_policy: string | null;
  delivery_policy: string | null;
  warranty_type: "as_is" | "warranty";
  warranty_details: string | null;
  discovery_notes: string | null;
  financing_process: string | null;
  out_of_state_process: string | null;
  what_to_bring: string | null;
  paperwork_handled: string | null;
  is_demo: boolean;
};

const PUBLIC_DEALER_COLUMNS =
  "id, slug, domain, name, tagline, phone, address, hours, owner_name, years_in_business, vehicle_type, hold_policy, trade_policy, delivery_policy, warranty_type, warranty_details, discovery_notes, financing_process, out_of_state_process, what_to_bring, paperwork_handled, is_demo";

export const DEALER_ID_HEADER = "x-dealer-id";
export const DEALER_SLUG_HEADER = "x-dealer-slug";
export const PATHNAME_HEADER = "x-pathname";

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
    .select(PUBLIC_DEALER_COLUMNS)
    .eq("id", dealerId)
    .single();

  if (error) throw error;
  return data as unknown as Dealer;
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
