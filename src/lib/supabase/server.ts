import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isServerSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseServiceRoleKey &&
    supabaseUrl !== "https://your-project.supabase.co" &&
    supabaseServiceRoleKey !== "your-service-role-key"
);

/**
 * Server-side Admin / Service Role Supabase Client.
 * Bypasses RLS only for trusted server operations (e.g. webhook handling, order creation).
 * Returns null if credentials are not configured in environment.
 */
export function getServiceSupabase() {
  if (!isServerSupabaseConfigured) {
    return null;
  }

  return createClient<Database>(supabaseUrl!, supabaseServiceRoleKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
