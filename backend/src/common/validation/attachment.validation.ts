import { z } from "zod";

export const AttachmentTypeSchema = z.enum([
  "PRESCRIPTION",
  "REPORT",
]);

export const CreateAttachmentSchema = z.object({
  url: z
    .string()
    .trim()
    .url("Attachment URL must be a valid URL"),

  secretKey: z
    .string()
    .trim()
    .nullable()
    .optional(),

  type: AttachmentTypeSchema,

  prescriptionId: z
    .coerce
    .bigint({ message: "Prescription ID must be a valid number" }),
});
