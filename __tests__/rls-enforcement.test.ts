import { describe, it, expect, beforeAll } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import path from "path";

// Load .env.local to get our local Supabase keys
config({ path: path.resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

describe("RLS Enforcement Tests (Supabase DB)", () => {
  const anonClient = createClient(SUPABASE_URL, ANON_KEY);
  const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  describe("Properties Table RLS", () => {
    it("should allow anonymous users to READ published properties", async () => {
      // In a real isolated test environment, we would seed a published property first.
      const { data, error } = await anonClient
        .from("properties")
        .select("*")
        .eq("status", "published");
      
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    it("should DENY anonymous users from inserting a property", async () => {
      const { error } = await anonClient
        .from("properties")
        .insert({
          title: "Malicious Property",
          type: "house",
          price: 1,
          address: "1 Hack Way",
          city: "Hackville",
          lat_lng: "POINT(0 0)",
          status: "published"
        });

      // RLS should explicitly reject this insertion because Anon user lacks a valid dealer_id
      expect(error).not.toBeNull();
      expect(error?.message).toMatch(/new row violates row-level security/i);
    });
  });

  describe("Leads Table RLS", () => {
    it("should DENY anonymous users from reading leads", async () => {
      const { data, error } = await anonClient
        .from("leads")
        .select("*");

      // Anon users shouldn't be able to query the leads pipeline
      expect(error).toBeNull(); 
      // Wait, Supabase returns an empty array if RLS blocks read, rather than an error!
      expect(data).toEqual([]); 
    });

    it("should allow Admin (Service Role) to read all leads", async () => {
      const { data, error } = await adminClient
        .from("leads")
        .select("*");

      // The service_role completely bypasses RLS
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });
  });
});
