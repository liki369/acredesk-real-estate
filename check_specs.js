require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSpecs() {
  console.log("Checking DB properties...");
  const { data, error } = await supabaseAdmin.from("properties").select("*");
  if (error) console.error("Fetch Error:", error);
  else {
    console.log("Found properties count:", data.length);
    data.forEach((p, idx) => {
      console.log(`Property #${idx + 1}:`, {
        id: p.id,
        title: p.title,
        type: p.type,
        specs: p.specs,
        specs_typeof: typeof p.specs
      });
    });
  }
}

checkSpecs();
