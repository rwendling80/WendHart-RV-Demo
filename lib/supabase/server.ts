import { createClient } from "@supabase/supabase-js";

// Server-only client using the "secret" key. This key bypasses Row Level
// Security, so it must NEVER be imported from a Client Component or exposed
// via a NEXT_PUBLIC_ env var — only use it inside Route Handlers, Server
// Actions, or Server Components that run exclusively on the server.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);
