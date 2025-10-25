import { createClient } from '@supabase/supabase-js';

// Environment Variables yang perlu Anda buat di .env.local:
// NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

