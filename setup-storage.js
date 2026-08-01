import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupStorage() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error("Error listing buckets:", listError);
    return;
  }
  
  const bucketName = "furniture";
  const exists = buckets.find(b => b.name === bucketName);
  
  if (!exists) {
    console.log(`Creating bucket '${bucketName}'...`);
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'],
      fileSizeLimit: 10485760 // 10MB
    });
    
    if (error) {
      console.error("Error creating bucket:", error);
    } else {
      console.log("Bucket created successfully:", data);
    }
  } else {
    console.log(`Bucket '${bucketName}' already exists.`);
  }
}

setupStorage();
