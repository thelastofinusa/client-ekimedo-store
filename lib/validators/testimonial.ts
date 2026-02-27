import { z } from "zod";

export const testimonialSchema = z
  .object({
    review: z
      .string()
      .min(10, "Review must be at least 10 characters.")
      .max(500, "Review must not exceed 500 characters."),
    rating: z.string("Please select a rating").min(1, "Please select a rating"),
    service: z.string().min(1, "Please select a service."),
    customService: z.string().optional(),
    workAssets: z.array(z.file()).optional(),
  })
  .refine(
    (data) =>
      data.service !== "custom" ||
      (data.customService && data.customService.trim().length > 0),
    {
      path: ["customService"],
      message: "Please specify your custom service.",
    },
  );

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;
