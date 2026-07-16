// FRONTEND CONFIG - these two values are SAFE to expose in the browser.
// The publishable (anon) key only grants what your Row Level Security policies allow.
// NEVER put the sb_secret_... (service_role) key here.
const SUPABASE_CONFIG = {
  url: "https://cbfiigypkzoymjitidwk.supabase.co", // your Supabase Project URL
    anonKey: "PASTE_YOUR_sb_publishable_KEY_HERE", // Settings > API Keys > Publishable key
    };
