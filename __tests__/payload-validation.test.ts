import { describe, it, expect } from "vitest";
import { 
  PropertyInsertSchema, 
  LeadInsertSchema, 
  PropertyStatusEnum 
} from "../src/lib/validations/index";

describe("Payload Validation Tests (Zod)", () => {
  
  describe("Property Insert Schema", () => {
    it("should accept a completely valid property payload", () => {
      const validPayload = {
        title: "Modern Glass House",
        type: "house",
        price: "1500000",
        address: "123 Beverly Hills",
        city: "Los Angeles",
        lat: 34.0736,
        lng: -118.4004,
        status: "draft"
      };

      const result = PropertyInsertSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.price).toBe(1500000); // Coerced to number
        expect(result.data.status).toBe("draft");
      }
    });

    it("should reject a property with a negative price", () => {
      const invalidPayload = {
        title: "Modern Glass House",
        type: "house",
        price: -5000,
        address: "123 Beverly Hills",
        city: "Los Angeles",
        lat: 34.0736,
        lng: -118.4004
      };

      const result = PropertyInsertSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("positive number");
      }
    });

    it("should reject an invalid property type", () => {
      const invalidPayload = {
        title: "Modern Glass House",
        type: "spaceship", // Invalid enum
        price: 1500000,
        address: "123 Beverly Hills",
        city: "Los Angeles",
        lat: 34.0736,
        lng: -118.4004
      };

      const result = PropertyInsertSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("should enforce geographic coordinate limits", () => {
      const invalidPayload = {
        title: "Off-world Base",
        type: "land",
        price: 100,
        address: "Moon Crater 5",
        city: "Luna",
        lat: 91, // Max is 90
        lng: -118.4004
      };

      const result = PropertyInsertSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe("Lead Insert Schema", () => {
    it("should require a valid email in the customer info", () => {
      const invalidPayload = {
        customer_info: {
          name: "John Doe",
          email: "not-an-email"
        }
      };

      const result = LeadInsertSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("email");
      }
    });

    it("should automatically default to 'new' stage if omitted", () => {
      const validPayload = {
        customer_info: {
          name: "John Doe",
          email: "john@example.com"
        }
      };

      const result = LeadInsertSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.stage).toBe("new");
      }
    });
  });
});
