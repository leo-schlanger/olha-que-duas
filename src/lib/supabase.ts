import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let clientPromise: Promise<SupabaseClient | null> | null = null;

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Supabase client, created on first use. supabase-js (~50 KB br) is a lazy
 * chunk so it stays out of the first paint (perf, 21/11/2026); callers are
 * all async query functions. Null when the env is missing.
 */
export function loadSupabase(): Promise<SupabaseClient | null> {
  if (!clientPromise) {
    clientPromise = isSupabaseConfigured()
      ? import('@supabase/supabase-js').then(({ createClient }) => createClient(supabaseUrl, supabaseAnonKey))
      : Promise.resolve(null);
  }
  return clientPromise;
}

export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl));
};

export const getSupabaseUrl = () => {
  return supabaseUrl && isValidUrl(supabaseUrl) ? supabaseUrl : null;
};
