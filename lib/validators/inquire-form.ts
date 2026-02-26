import z from "zod";

export const inquireFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  email: z
    .email("Please enter a valid email address")
    .trim()
    .max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits"),
  eventType: z.string().min(1, "Please select an event type"),
  eventDate: z.date(),
  budget: z.string().min(1, "Please select an estimated budget"),
  dreamDress: z
    .string()
    .trim()
    .min(20, "Please describe your dream dress in at least 20 characters")
    .max(2000, "Description must be less than 2000 characters"),
});

export type InquireFormSchemaType = z.infer<typeof inquireFormSchema>;
