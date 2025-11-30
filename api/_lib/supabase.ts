import { createClient } from '@supabase/supabase-js';
declare const process: any;

const SUPABASE_URL = (process?.env?.SUPABASE_URL || process?.env?.VITE_SUPABASE_URL || '') as string;
const SUPABASE_SERVICE_ROLE_KEY = (process?.env?.SUPABASE_SERVICE_ROLE_KEY || process?.env?.VITE_SUPABASE_SERVICE_ROLE_KEY) as string | undefined;
const SUPABASE_ANON_KEY = (process?.env?.SUPABASE_ANON_KEY || process?.env?.VITE_SUPABASE_ANON_KEY) as string | undefined;

if (!SUPABASE_URL) {
  console.warn('[supabase] SUPABASE_URL is not set');
}

const serviceOrAnon = (SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY || '') as string;

export const supabase = createClient(SUPABASE_URL, serviceOrAnon, {
  auth: { autoRefreshToken: false, persistSession: false },
});

