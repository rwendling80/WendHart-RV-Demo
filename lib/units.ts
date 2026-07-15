import { supabasePublic } from "@/lib/supabase/client";

export type UnitPhoto = {
  id: string;
  url: string;
  sort_order: number;
  is_primary: boolean;
};

// Public-safe shape. Deliberately excludes floor_price_cents -- see
// AdminUnit below and the column-level grants in
// supabase/migration_floor_price.sql for why that's not just a type-level
// convention.
export type Unit = {
  id: string;
  category: string;
  rv_type: string | null;
  vin: string | null;
  year: number | null;
  make: string | null;
  model: string | null;
  price_cents: number;
  status: "available" | "sold";
  sold_at: string | null;
  condition_notes: string | null;
  description: string | null;
  specs: Record<string, unknown>;
  created_at: string;
  unit_photos: UnitPhoto[];
};

// Admin-only shape (used with supabaseAdmin, never supabasePublic). Adds the
// dealer's bottom-dollar floor price -- ADMIN-ONLY, chatbot-triage data for
// Phase 2 (flag a hot offer to the dealer), never a quote/acceptance source,
// and never rendered on any public page.
export type AdminUnit = Unit & {
  floor_price_cents: number | null;
};

const PUBLIC_UNIT_COLUMNS =
  "id, dealer_id, category, rv_type, vin, year, make, model, price_cents, status, sold_at, condition_notes, description, specs, created_at, updated_at, unit_photos(*)";

export type InventoryFilters = {
  minPrice?: number;
  maxPrice?: number;
  rvType?: string;
  minSleeps?: number;
  minYear?: number;
  maxYear?: number;
};

const SOLD_BANNER_DAYS = 7;

// A sold unit still shows (with a SOLD banner) for this many days, then
// drops out of the public listing entirely.
export function isVisible(unit: Pick<Unit, "status" | "sold_at">): boolean {
  if (unit.status === "available") return true;
  if (!unit.sold_at) return true;
  const soldAt = new Date(unit.sold_at).getTime();
  const cutoff = Date.now() - SOLD_BANNER_DAYS * 24 * 60 * 60 * 1000;
  return soldAt > cutoff;
}

export function primaryPhoto(unit: Pick<Unit, "unit_photos">): string | null {
  if (!unit.unit_photos || unit.unit_photos.length === 0) return null;
  const sorted = [...unit.unit_photos].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return a.sort_order - b.sort_order;
  });
  return sorted[0].url;
}

export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export async function fetchVisibleUnits(
  dealerId: string,
  filters: InventoryFilters = {}
): Promise<Unit[]> {
  const { data, error } = await supabasePublic
    .from("units")
    .select(PUBLIC_UNIT_COLUMNS)
    .eq("dealer_id", dealerId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data as unknown as Unit[]).filter((unit) => {
    if (!isVisible(unit)) return false;
    if (filters.minPrice != null && unit.price_cents < filters.minPrice * 100)
      return false;
    if (filters.maxPrice != null && unit.price_cents > filters.maxPrice * 100)
      return false;
    if (filters.rvType && unit.rv_type !== filters.rvType) return false;
    if (filters.minYear != null && (unit.year ?? 0) < filters.minYear)
      return false;
    if (filters.maxYear != null && (unit.year ?? 0) > filters.maxYear)
      return false;
    if (filters.minSleeps != null) {
      const sleeps = Number(unit.specs?.sleeps ?? 0);
      if (sleeps < filters.minSleeps) return false;
    }
    return true;
  });
}

export async function fetchUnitById(
  dealerId: string,
  id: string
): Promise<Unit | null> {
  const { data, error } = await supabasePublic
    .from("units")
    .select(PUBLIC_UNIT_COLUMNS)
    .eq("dealer_id", dealerId)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as Unit | null;
}
