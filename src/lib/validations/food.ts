import { z } from "zod";

export const foodItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.enum(["portions", "loaves", "pieces", "kg", "lbs"]),
  expiresAt: z.string().datetime({ message: "Must be a valid ISO string" }),
  status: z.enum(['AVAILABLE', 'PENDING_CLAIM', 'CLAIMED', 'IN_TRANSIT', 'DELIVERED']),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

export type FoodItem = z.infer<typeof foodItemSchema>;

export const posDropPayloadSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.enum(["portions", "loaves", "pieces", "kg", "lbs"]),
  hoursUntilExpiry: z.number().positive(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

export type POSDropPayload = z.infer<typeof posDropPayloadSchema>;
