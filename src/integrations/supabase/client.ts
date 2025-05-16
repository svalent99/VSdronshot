
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Using the hardcoded values since this project doesn't use environment variables
const SUPABASE_URL = "https://jpdrjoqpsynbuqjdazst.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZHJqb3Fwc3luYnVxamRhenN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTIwOTIsImV4cCI6MjA2MDU2ODA5Mn0.--OkDKbGbQiBpGR4K_A_3gY6aHODel8CjSMcKP2fBcE";

// Mask key for safe logging
const maskedKey = SUPABASE_PUBLISHABLE_KEY.substring(0, 10) + '...' + SUPABASE_PUBLISHABLE_KEY.substring(SUPABASE_PUBLISHABLE_KEY.length - 5);

// Initialize the Supabase client with explicit auth configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage
  }
});

// Log enhanced Supabase client initialization information
console.log("⚙️ Supabase client initialized with URL:", SUPABASE_URL);
console.log("🔑 Using key (truncated for security):", maskedKey);
console.log("📊 Project reference:", SUPABASE_URL.split('//')[1].split('.')[0]);

// Add a function to check and list available buckets
export const debugStorageBuckets = async () => {
  try {
    console.log("🔍 Checking available storage buckets...");
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error("❌ No session found. Authentication required to list buckets.");
      return [];
    }
    
    console.log("✅ User authenticated:", session.user.id);
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("❌ Error listing buckets:", error);
      return [];
    }
    
    console.log("📁 Available buckets:", buckets?.length ? buckets.map(b => b.name) : "None");
    
    // Check specifically for galeriavs bucket
    const hasGaleriavsBucket = buckets?.some(bucket => bucket.name === 'galeriavs');
    if (hasGaleriavsBucket) {
      console.log("✅ 'galeriavs' bucket found in the list!");
    } else {
      console.warn("⚠️ 'galeriavs' bucket NOT FOUND in the accessible buckets list!");
      console.warn("⚠️ Please verify that:");
      console.warn("  - The bucket 'galeriavs' exists in this Supabase project");
      console.warn("  - The authenticated user has permissions to access it");
      console.warn("  - The bucket name is spelled exactly as 'galeriavs' (case sensitive)");
    }
    
    return buckets || [];
  } catch (error) {
    console.error("❌ Critical error checking buckets:", error);
    return [];
  }
};
