import { supabasePublic } from "@/lib/supabase/client";

export type UnitPhoto = {
  id: string;
  url: string;
  sort_order: number;
  is_primary: boolean;
};

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

export type InventoryFilters = {
  minPrice?: number;
  maxPrice?: number;
  rvType?: string;
  minSleeps?: number;
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
    .select("*, unit_photos(*)")
    .eq("dealer_id", dealerId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data as Unit[]).filter((unit) => {
    if (!isVisible(unit)) return false;
    if (filters.minPrice != null && unit.price_cents < filters.minPrice * 100)
      return false;
    if (filters.maxPrice != null && unit.price_cents > filters.maxPrice * 100)
      return false;
    if (filters.rvType && unit.rv_type !== filters.rvType) return false;
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
    .select("*, unit_photos(*)")
    .eq("dealer_id", dealerId)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as Unit | null;
}
