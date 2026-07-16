// Creates a single Supabase client used across the app.
// Requires the supabase-js CDN script and config.js to load first (see index.html).
const supabaseClient = supabase.createClient(
SUPABASE_CONFIG.url,
SUPABASE_CONFIG.anonKey
);
