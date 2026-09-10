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

  if (usersData.users.length === 0) {
    console.log("No users found. Database is already clean.");
    return;
  }

  let deletedCount = 0;
  for (const user of usersData.users) {
    console.log(`Deleting user: ${user.email} (${user.id})`);
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteError) {
      console.error(`Failed to delete ${user.email}:`, deleteError);
    } else {
      deletedCount++;
    }
  }
  
  console.log(`\nSuccess! Wiped ${deletedCount} user(s) and all their associated data (properties, leads) via cascading deletes.`);
}

main();
