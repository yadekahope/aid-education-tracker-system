
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uqqueyjjclqopgxblpuc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxcXVleWpqY2xxb3BneGJscHVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NDczNTcsImV4cCI6MjA2MTQyMzM1N30.PUnqHMp7Bsy1Vb991pbXiElBguLojm6s8NHnuajaP60";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});
