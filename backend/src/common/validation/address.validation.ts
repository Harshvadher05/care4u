import { z } from "zod";

export const addressSchema = z.object({
  addressLine1: z
    .string()
    .trim()
    .min(1, "Address Line 1 is required")
    .max(255, "Address Line 1 is too long"),

  addressLine2: z
    .string()
    .trim()
    .max(255, "Address Line 2 is too long")
    .optional(),

  city: z
    .string()
    .trim()
    .min(1, "City is required"),

  state: z
    .string()
    .trim()
    .min(1, "State is required"),

  country: z
    .string()
    .trim()
    .min(1, "Country is required"),

  pincode: z
    .string()
    .regex(/^\d{6}$/, "Pincode must be 6 digits"),
});
