import { createClient } from "@supabase/supabase-js";

// Used in the browser and in Server Components that only need to READ
// public data (available inventory, photos) or insert a lead. Backed by
// the "publishable" key — safe to expose, since Row Level Security only
// grants it read access to units/unit_photos and insert-only on leads.
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);
