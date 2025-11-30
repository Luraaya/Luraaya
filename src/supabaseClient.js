import { createClient } from '@supabase/supabase-js'

const VITE_SUPABASE_URL = 'https://your-project-id.supabase.co' // ← get this from Supabase
VITE_SUPABASE_ANON_KEY = 'your-anon-key'                   // ← get this from Supabase

export const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)