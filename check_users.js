require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUsers() {
  console.log("Checking DB users table...");
  const { data, error } = await supabaseAdmin.from("users").select("*");
  if (error) console.error("Fetch Users Error:", error);
  else console.log("Users in DB:", data);
}

checkUsers();
