import {createClient} from '@supabase/supabase-js'
 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://bgvyusksldllhwmbbuek.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJndnl1c2tzbGRsbGh3bWJidWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NjMwOTcsImV4cCI6MjA3MTQzOTA5N30.uc2gma8GVXUOnp_p0SXC-Llpk29dhDKR8_5oz7AHfh4';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)