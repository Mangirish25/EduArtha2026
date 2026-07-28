import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabaseEnvStatus = {
  hasUrl: Boolean(supabaseUrl),
  hasPublishableKey: Boolean(supabasePublishableKey),
  message:
    supabaseUrl && supabasePublishableKey
      ? "Supabase is configured."
      : "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local."
};

let cachedClient: SupabaseClient | null = null;

export async function getSupabaseClient() {
  if (!isSupabaseConfigured) return null;
  if (cachedClient) return cachedClient;

  const { createClient } = await import("@supabase/supabase-js");
  cachedClient = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  });

  return cachedClient;
}
