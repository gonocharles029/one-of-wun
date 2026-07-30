import { createClient } from "@supabase/supabase-js";

// Directly using your Supabase project URL and key
const supabaseUrl = "https://pdnwwumqabgkcsorronh.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);