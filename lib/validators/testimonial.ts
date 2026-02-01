import { z } from "zod";

export const testimonialSchema = z.object({
  review: z
    .string()
    .min(10, { message: "Review must be at least 10 characters." })
    .max(500, { message: "Review must not exceed 500 characters." }),
  rating: z.coerce
    .number()
    .min(1, { message: "Rating must be at least 1." })
    .max(5, { message: "Rating must be at most 5." }),
  categoryId: z.string().min(1, { message: "Please select a category." }),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;
