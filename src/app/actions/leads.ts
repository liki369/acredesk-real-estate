"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { LeadInsertSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

// Called by the public Customer Landing Page/Contact Form
export async function submitLead(prevState: any, formData: FormData) {
  // We use the admin client because public visitors aren't logged in,
  // and our DB RLS requires Leads to only be read/updated by assigned agents.
  // We bypass RLS to *insert* a new lead on behalf of the public user.
  const supabaseAdmin = await createAdminClient();
  
  const rawData = {
    property_id: formData.get("property_id") || undefined,
    customer_info: {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      budget: formData.get("budget"),
      viewing_preference: formData.get("viewing_preference"),
      notes: formData.get("notes"),
    }
  };

  const validated = LeadInsertSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: "Invalid form data", details: validated.error.flatten() };
  }

  // Determine an agent to assign this lead to (dealer or admin).
  const { data: availableUsers } = await supabaseAdmin
    .from("users")
    .select("id")
    .limit(1);

  let assignedAgentId = availableUsers && availableUsers.length > 0 ? availableUsers[0].id : null;

  if (!assignedAgentId) {
    // If database was freshly wiped and has no users yet, create a system agent
    const { data: newAuthUser } = await supabaseAdmin.auth.admin.createUser({
      email: "system.salesdesk@acredesk.internal",
      password: "SalesDeskPassword123!",
      email_confirm: true,
    });
    if (newAuthUser?.user) {
      assignedAgentId = newAuthUser.user.id;
    }
  }

  if (!assignedAgentId) {
    return { error: "Unable to allocate agent for inquiry." };
  }

  const { error } = await supabaseAdmin
    .from("leads")
    .insert({
      property_id: validated.data.property_id,
      customer_info: validated.data.customer_info,
      stage: "new",
      assigned_agent_id: assignedAgentId
    });

  if (error) {
    console.error("Lead Insert Error:", error);
    return { error: "Failed to submit enquiry" };
  }

  revalidatePath("/admin/dashboard");
  return { success: true };
}

// Called by the internal Dealer & Admin Dashboard CRM
export async function updateLeadStage(leadId: string, newStage: string) {
  const supabaseAdmin = await createAdminClient();
  
  const { error } = await supabaseAdmin
    .from("leads")
    .update({ stage: newStage, updated_at: new Date().toISOString() })
    .eq("id", leadId);

  if (error) {
    console.error("Update Lead Stage Error:", error);
    return { error: "Failed to update lead status" };
  }

  revalidatePath("/crm");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

// Permanently delete a lead from the database
export async function deleteLead(leadId: string) {
  const supabaseAdmin = await createAdminClient();
  
  const { error } = await supabaseAdmin
    .from("leads")
    .delete()
    .eq("id", leadId);

  if (error) {
    console.error("Delete Lead Error:", error);
    return { error: "Failed to delete lead" };
  }

  revalidatePath("/crm");
  revalidatePath("/admin/dashboard");
  return { success: true };
}
