import z from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

const formSchema = z.object({
  fName: z
    .string("First name is required")
    .min(2, "At least 2 characters long")
    .max(50, "At least 50 characters long"),
  lName: z
    .string("Last name is required")
    .min(2, "At least 2 characters long")
    .max(50, "At least 50 characters long"),
  email: z.email("Email address is required").min(4, "Invalid email address"),
  inquiryType: z.string("Select an inquiry type"),
  phone: z
    .string("Phone number is required")
    .min(2, "Phone number is required")
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  message: z
    .string("Message is required")
    .min(10, "At least 10 characters long")
    .max(1000, "At least 1000 characters long"),
});

type FormType = z.infer<typeof formSchema>;

export { formSchema, type FormType };
