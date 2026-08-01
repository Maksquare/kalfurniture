import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  // Query to get columns of 'products' table using Postgres standard information_schema
  const { data: productsData, error: productsError } = await supabase.rpc('get_columns', { table_name: 'products' });
  
  // If rpc doesn't exist, we can just select one row and see its keys
  const { data, error } = await supabase.from('products').select('*').limit(1);
  if (error) {
    console.error("Error fetching products:", error);
  } else if (data && data.length > 0) {
    console.log("Products columns:", Object.keys(data[0]));
  } else {
    console.log("Products table is empty, can't infer schema from select.");
  }

  const { data: pkgData, error: pkgError } = await supabase.from('packages').select('*').limit(1);
  if (pkgError) {
    console.error("Error fetching packages:", pkgError);
  } else if (pkgData && pkgData.length > 0) {
    console.log("Packages columns:", Object.keys(pkgData[0]));
  } else {
    console.log("Packages table is empty.");
  }
}

checkSchema();
