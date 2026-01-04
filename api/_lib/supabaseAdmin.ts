import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.VITE_SUPABASE_URL;
  const key =
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!url) throw new Error("MISSING_ENV:VITE_SUPABASE_URL");
  if (!key) throw new Error("MISSING_ENV:VITE_SUPABASE_SERVICE_ROLE_KEY");

  cached = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { "Content-Type": "application/json" } },
  });

  return cached;
}
