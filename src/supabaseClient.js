import { createClient } from '@supabase/supabase-js'

const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
// oder, wenn deine App VITE_SUPABASE_KEY erwartet:
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || VITE_SUPABASE_ANON_KEY

if (!VITE_SUPABASE_URL) throw new Error('supabaseUrl is required.')
if (!SUPABASE_KEY) throw new Error('supabaseKey is required.')

export const supabase = createClient(VITE_SUPABASE_URL, SUPABASE_KEY)
