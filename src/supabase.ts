import { createClient } from "@supabase/supabase-js";

const metaEnv = (import.meta as any).env || {};

const supabaseUrl = metaEnv.VITE_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || "placeholder-key";

const isPlaceholder = !metaEnv.VITE_SUPABASE_URL || !metaEnv.VITE_SUPABASE_ANON_KEY;

console.log("=== SUPABASE RUNTIME CONFIGURATION ===");
console.log("URL:", supabaseUrl);
console.log("Anon Key:", supabaseAnonKey);
console.log("Configuration Source:", isPlaceholder ? "1. Placeholder fallback values" : "2. Real environment variables loaded from .env");
console.log("======================================");

if (isPlaceholder) {
  console.warn(
    "Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are not configured. Using placeholder configuration to prevent startup crash."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
