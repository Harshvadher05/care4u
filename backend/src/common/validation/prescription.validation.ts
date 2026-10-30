import { z } from "zod";
import { CreateAttachmentSchema } from "./attachment.validation.js";

export const CreatePrescriptionSchema = z.object({
  precautions: z
    .string()
    .trim()
    .min(1, "Precautions are required"),

  appointmentId: z
    .coerce
    .bigint({ message: "Appointment ID must be a valid number" }),

  attachments: z
    .array(CreateAttachmentSchema.omit({ prescriptionId: true }))
    .optional(),
});
