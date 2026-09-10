import { z } from "zod";

// --- Properties Schema ---
export const PropertyStatusEnum = z.enum(['draft', 'pending_review', 'published', 'sold']);
export const PropertyTypeEnum = z.enum(['land', 'plot', 'house', 'villa', 'commercial']);

export const PropertyInsertSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  type: PropertyTypeEnum,
  price: z.coerce.number().positive("Price must be a positive number"),
  address: z.string().min(5, "Address must be provided"),
  city: z.string().min(2, "City is required"),
  // Note: we can accept lat/lng directly and parse it server side for postGIS geography
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  media_urls: z.array(z.string().url()).optional().default([]),
  status: PropertyStatusEnum.default('draft'),
  specs: z.record(z.string(), z.any()).optional().default({}),
});

// --- Leads Schema ---
export const LeadStageEnum = z.enum(['new', 'contacted', 'site_visit', 'negotiating', 'closed']);

export const LeadInsertSchema = z.object({
  property_id: z.string().uuid().optional(),
  customer_info: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    budget: z.string().optional(),
    viewing_preference: z.string().optional(),
    notes: z.string().optional()
  }),
  stage: LeadStageEnum.default('new'),
});

// --- File Upload Schema (Add Asset Form) ---
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export const FileUploadSchema = z.object({
  file: z.any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file?.type),
      "Only .jpg, .png, .webp, and .pdf formats are supported."
    ),
});
