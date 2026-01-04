import { createClient } from "@supabase/supabase-js";

let cached = null;

export function getSupabaseAdmin() {
  // Falls der Client bereits existiert, gib ihn zurück
  if (cached) return cached;

  // Laden der Umgebungsvariablen aus Vercel
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Sicherheitscheck: Sind die Variablen überhaupt vorhanden?
  if (!url) throw new Error("MISSING_ENV:SUPABASE_URL");
  if (!key) throw new Error("MISSING_ENV:SUPABASE_SERVICE_ROLE_KEY");

  // --- DEBUG LOGS (WICHTIG!) ---
  // Diese Zeilen erscheinen in deinem Vercel Dashboard unter "Logs"
  console.log("DEBUG_CONNECTION_URL:", url);
  console.log("DEBUG_KEY_START:", key.substring(0, 8));
  // ------------------------------

  // Initialisierung des Supabase Clients
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