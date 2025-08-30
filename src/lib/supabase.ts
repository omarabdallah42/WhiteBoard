import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}
if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Types for our database
export type User = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type Whiteboard = {
  id: string;
  user_id: string;
  name: string;
  data: any; // This will store the whiteboard state
  created_at: string;
  updated_at: string;
};

export type WindowItem = {
  id: string;
  whiteboard_id: string;
  type: string;
  title: string;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  is_attached: boolean;
  z_index: number;
  connections: { from: string; to: string }[];
  created_at: string;
  updated_at: string;
};
