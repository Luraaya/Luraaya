import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  // Korrektur: Wir nutzen die Variablen ohne VITE_, da diese in Vercel hinterlegt sind
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("MISSING_ENV:SUPABASE_URL");
  if (!key) throw new Error("MISSING_ENV:SUPABASE_SERVICE_ROLE_KEY");

  // Debug-Log für die Vercel-Logs (hilft uns zu sehen, ob die URL stimmt)
  console.log(`Connecting to Supabase Project: ${url.substring(0, 20)}...`);

  cached = createClient(url, key, {
    auth: { 
      autoRefreshToken: false, 
      persistSession: false 
    },
    global: { 
      headers: { "Content-Type": "application/json" } 
    },
  });

  return cached;
}