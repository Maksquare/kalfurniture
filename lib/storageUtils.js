import { supabase } from "./supabase";

/**
 * Uploads a file to the Supabase 'furniture' bucket and returns its public URL.
 * 
 * @param {File} file - The File object (from an <input type="file">)
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export async function uploadImageToStorage(file) {
  if (!supabase) throw new Error("Supabase client is not initialized.");

  // Generate a unique filename using timestamp and a random string
  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  
  // Upload to the 'furniture' bucket
  const { data, error } = await supabase.storage
    .from("furniture")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Storage upload error:", error);
    throw new Error(error.message);
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from("furniture")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}
