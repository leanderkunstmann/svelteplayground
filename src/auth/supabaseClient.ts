import { createClient } from '@supabase/supabase-js'

// @ts-ignore
const supabaseUrl = __api.env.SVELTE_APP_SUPABASE_URL
// @ts-ignore
const supabaseAnonKey = __api.env.SVELTE_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)