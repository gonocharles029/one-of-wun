import { createClient } from "@supabase/supabase-js";

// Uses environment variables set in Vercel / .env.local with safe build fallbacks
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pdnwwumqabgkcsorronh.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key-for-build";

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  console.warn(
    "⚠️ Supabase environment variables missing. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are defined in .env.local or Vercel."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);