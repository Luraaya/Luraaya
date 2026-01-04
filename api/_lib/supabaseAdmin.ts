import { createClient } from "@supabase/supabase-js";

let cached = null;

export function getSupabaseAdmin() {
  if (cached) return cached;

  // Wir greifen exakt auf die Namen zu, die du gerade in Vercel gespeichert hast
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("KRITISCHER_FEHLER: Supabase URL oder Key fehlen in den Umgebungsvariablen!");
  }

  cached = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  return cached;
}