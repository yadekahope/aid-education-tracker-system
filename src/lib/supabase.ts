
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from the project itself (no environment variables needed)
const supabaseUrl = "https://uqqueyjjclqopgxblpuc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxcXVleWpqY2xxb3BneGJscHVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NDczNTcsImV4cCI6MjA2MTQyMzM1N30.PUnqHMp7Bsy1Vb991pbXiElBguLojm6s8NHnuajaP60";

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});
