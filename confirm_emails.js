require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log("Fetching all users...");
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error("Error listing users:", listError);
    return;
  }

  let confirmedCount = 0;
  for (const user of usersData.users) {
    if (!user.email_confirmed_at) {
      console.log(`Confirming email for: ${user.email}`);
      const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
        email_confirm: true
      });
      if (updateError) {
        console.error(`Failed to confirm ${user.email}:`, updateError);
      } else {
        confirmedCount++;
      }
    }
  }
  
  console.log(`\nSuccess! Confirmed ${confirmedCount} unconfirmed user(s).`);
}

main();
