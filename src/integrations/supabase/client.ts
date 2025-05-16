
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Using the hardcoded values since this project doesn't use environment variables
const SUPABASE_URL = "https://jpdrjoqpsynbuqjdazst.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZHJqb3Fwc3luYnVxamRhenN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTIwOTIsImV4cCI6MjA2MDU2ODA5Mn0.--OkDKbGbQiBpGR4K_A_3gY6aHODel8CjSMcKP2fBcE";

// Initialize the Supabase client with explicit auth configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage
  }
});

// Log supabase client initialization
console.log("Supabase client initialized with URL:", SUPABASE_URL);
