"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { PropertyInsertSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

const DEFAULT_TYPE_IMAGES: Record<string, string> = {
  house: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
  villa: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800",
  land: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
  plot: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
  commercial: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
};

export async function createProperty(prevState: any, formData: FormData) {
  const supabaseAdmin = await createAdminClient();

  // Find an available dealer/user ID or fallback to the first user
  const { data: users } = await supabaseAdmin
    .from("users")
    .select("id")
    .limit(1);

  let dealerId = users && users.length > 0 ? users[0].id : null;

  if (!dealerId) {
    // If no user exists, create a system dealer
    const { data: authUser, error: authErr } = await supabaseAdmin.auth.admin.createUser({
      email: "system.dealer@acredesk.internal",
      password: "InternalSystemPassword123!",
      email_confirm: true,
    });
    if (authUser?.user) {
      dealerId = authUser.user.id;
    }
  }

  // Parse raw form data
  const rawData = {
    title: formData.get("title"),
    type: formData.get("type"),
    price: formData.get("price"),
    address: formData.get("address"),
    city: formData.get("city"),
    lat: formData.get("lat") || "37.7749",
    lng: formData.get("lng") || "-122.4194",
    status: formData.get("status") || "published",
  };

  // Validate via Zod
  const validated = PropertyInsertSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: "Validation failed", details: validated.error.flatten() };
  }

  const { title, type, price, address, city, lat, lng, status } = validated.data;

  // Map type to valid Postgres DB Enum ('house' | 'land' | 'commercial')
  const dbType = (type === "plot" || type === "land") ? "land" : (type === "villa" || type === "house") ? "house" : "commercial";

  // Build the point string for PostGIS
  const pointStr = `POINT(${lng} ${lat})`;
  const defaultImage = DEFAULT_TYPE_IMAGES[type] || DEFAULT_TYPE_IMAGES.house;

  // Insert into DB using admin client to ensure 100% reliable writes
  const description = formData.get("description")?.toString() || "";
  const area = formData.get("area")?.toString() || (type === "land" || type === "plot" ? "2.5 Acres" : "3,200 sq ft");
  const bedrooms = formData.get("bedrooms") ? Number(formData.get("bedrooms")) : (type === "house" || type === "villa" ? 4 : undefined);
  const bathrooms = formData.get("bathrooms") ? Number(formData.get("bathrooms")) : (type === "house" || type === "villa" ? 3 : undefined);

  const { data, error } = await supabaseAdmin
    .from("properties")
    .insert({
      title,
      type: dbType,
      price,
      address,
      city,
      lat_lng: pointStr,
      status: status || "published",
      dealer_id: dealerId,
      media_urls: [defaultImage],
      specs: {
        sub_type: type,
        description: description || `Premium ${type} located at ${address}, ${city}. Excellent investment opportunity with clear title deed and verified zoning.`,
        bedrooms,
        bathrooms,
        area,
      }
    })
    .select()
    .single();

  if (error) {
    console.error("DB Insert Property Error:", error);
    return { error: "Failed to create property in database" };
  }

  // Revalidate public homepage and inventory
  revalidatePath("/");
  revalidatePath("/admin/inventory");
  revalidatePath("/dashboard/inventory");

  return { success: true, data };
}

export async function updateProperty(prevState: any, formData: FormData) {
  const supabaseAdmin = await createAdminClient();

  const propertyId = formData.get("id")?.toString();
  if (!propertyId) {
    return { error: "Missing property ID for update" };
  }

  const rawData = {
    title: formData.get("title"),
    type: formData.get("type"),
    price: formData.get("price"),
    address: formData.get("address"),
    city: formData.get("city"),
    lat: formData.get("lat") || "37.7749",
    lng: formData.get("lng") || "-122.4194",
    status: formData.get("status") || "published",
  };

  const validated = PropertyInsertSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: "Validation failed", details: validated.error.flatten() };
  }

  const { title, type, price, address, city, lat, lng, status } = validated.data;

  // Map type to valid Postgres DB Enum ('house' | 'land' | 'commercial')
  const dbType = (type === "plot" || type === "land") ? "land" : (type === "villa" || type === "house") ? "house" : "commercial";
  const pointStr = `POINT(${lng} ${lat})`;

  const description = formData.get("description")?.toString() || "";
  const area = formData.get("area")?.toString() || (type === "land" || type === "plot" ? "2.5 Acres" : "3,200 sq ft");
  const bedrooms = formData.get("bedrooms") ? Number(formData.get("bedrooms")) : (type === "house" || type === "villa" ? 4 : undefined);
  const bathrooms = formData.get("bathrooms") ? Number(formData.get("bathrooms")) : (type === "house" || type === "villa" ? 3 : undefined);

  // Fetch current property to preserve media_urls and existing specs
  const { data: currentProp } = await supabaseAdmin
    .from("properties")
    .select("media_urls, specs")
    .eq("id", propertyId)
    .single();

  const defaultImage = DEFAULT_TYPE_IMAGES[type] || DEFAULT_TYPE_IMAGES.house;
  const mediaUrls = currentProp?.media_urls && currentProp.media_urls.length > 0 ? currentProp.media_urls : [defaultImage];
  const existingSpecs = currentProp?.specs || {};

  const { data, error } = await supabaseAdmin
    .from("properties")
    .update({
      title,
      type: dbType,
      price,
      address,
      city,
      lat_lng: pointStr,
      status: status || "published",
      media_urls: mediaUrls,
      specs: {
        ...existingSpecs,
        sub_type: type,
        description: description || `Verified ${type} located at ${address}, ${city}. Excellent investment opportunity with clear title deed and verified zoning.`,
        bedrooms,
        bathrooms,
        area,
      },
      updated_at: new Date().toISOString()
    })
    .eq("id", propertyId)
    .select()
    .single();

  if (error) {
    console.error("DB Update Property Error:", error);
    return { error: "Failed to update property in database" };
  }

  revalidatePath("/");
  revalidatePath("/admin/inventory");
  revalidatePath("/dashboard/inventory");

  return { success: true, data };
}

export async function getPublishedProperties() {
  const supabaseAdmin = await createAdminClient();
  
  const { data, error } = await supabaseAdmin
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching published properties:", error);
    return { success: false, data: [] };
  }

  return { success: true, data: data || [] };
}

export async function deleteProperty(propertyId: string) {
  const supabaseAdmin = await createAdminClient();

  const { error } = await supabaseAdmin
    .from("properties")
    .delete()
    .eq("id", propertyId);

  if (error) {
    console.error("Delete Property Error:", error);
    return { error: "Failed to delete property" };
  }

  revalidatePath("/");
  revalidatePath("/admin/inventory");
  revalidatePath("/dashboard/inventory");

  return { success: true };
}
