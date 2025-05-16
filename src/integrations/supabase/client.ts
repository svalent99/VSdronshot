
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Using the provided values
const SUPABASE_URL = "https://jpdrjoqpsynbuqjdazst.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZHJqb3Fwc3luYnVxamRhenN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTIwOTIsImV4cCI6MjA2MDU2ODA5Mn0.--OkDKbGbQiBpGR4K_A_3gY6aHODel8CjSMcKP2fBcE";

// Mask key for safe logging 
const maskedKey = SUPABASE_PUBLISHABLE_KEY.substring(0, 10) + '...' + SUPABASE_PUBLISHABLE_KEY.substring(SUPABASE_PUBLISHABLE_KEY.length - 5);

console.log("🔄 Initializing Supabase client with:");
console.log("📌 URL:", SUPABASE_URL);
console.log("🔑 Key (masked):", maskedKey);
console.log("🆔 Project reference:", SUPABASE_URL.split('//')[1].split('.')[0]);

// Initialize the Supabase client with explicit auth configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage
  }
});

// Function to check and list available buckets for debugging
export const debugStorageBuckets = async () => {
  try {
    console.log("🔍 Checking available storage buckets...");
    
    // First verify authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error("❌ No session found when checking buckets. Authentication required.");
      return [];
    }
    console.log("✅ User authenticated when checking buckets:", session.user.id);
    
    // List all buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("❌ Error listing buckets:", error);
      return [];
    }
    
    // Log available buckets
    if (buckets && buckets.length > 0) {
      console.log("📂 Available buckets:", buckets.map(b => b.name).join(", "));
    } else {
      console.warn("⚠️ No storage buckets found in this project");
    }
    
    // Specifically check for the galeriavs bucket
    const hasGaleriavsBucket = buckets?.some(bucket => bucket.name === 'galeriavs');
    if (hasGaleriavsBucket) {
      console.log("✅ 'galeriavs' bucket found!");
    } else {
      console.warn("⚠️ 'galeriavs' bucket NOT FOUND in the list of accessible buckets!");
      console.warn("⚠️ Please verify that:");
      console.warn("  1. The bucket 'galeriavs' exists in this Supabase project");
      console.warn("  2. The authenticated user has permissions to access it");
      console.warn("  3. The bucket name is spelled exactly as 'galeriavs' (case sensitive)");
      console.warn("  4. You are connected to the correct Supabase project");
    }
    
    return buckets || [];
  } catch (error) {
    console.error("❌ Critical error checking buckets:", error);
    return [];
  }
};

// Run an initial check when the module loads (if in browser environment)
if (typeof window !== 'undefined') {
  setTimeout(() => {
    console.log("🚀 Running initial bucket check...");
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        debugStorageBuckets().then(buckets => {
          console.log(`Initial bucket check complete. Found ${buckets.length} buckets.`);
        });
      } else {
        console.log("⚠️ Initial bucket check skipped: No authenticated session");
      }
    });
  }, 1000); // Small delay to ensure other initialization completes
}
