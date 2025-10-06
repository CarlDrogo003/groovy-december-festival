// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// TODO: Replace with your actual project URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Initialize the Supabase client (singleton style)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
