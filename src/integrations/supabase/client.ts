import { createClient } from "@supabase/supabase-js";

// Anon (publishable) key — safe for the browser.
const SUPABASE_URL = "https://sapuvozigtbxowuzwgqq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_L9nd4PGSeqbOFTr7QsUTgg_AKskD3kR";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: typeof window !== "undefined",
    autoRefreshToken: typeof window !== "undefined",
  },
});
