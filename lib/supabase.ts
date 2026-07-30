import { createClient } from "@supabase/supabase-js";

// Your exact Supabase project URL and public key pre-configured
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://pdnwwumqabgkcsorronh.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkbnd3dW1xYWJna2Nzb3Jyb25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwOTc3NTYsImV4cCI6MjEwMDY3Mzc1Nn0.CIhJon-IxyFGS1HxReZEH-kmnEOTkl2YCGhOxvExpk4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);