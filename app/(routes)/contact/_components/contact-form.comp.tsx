"use client";
import z from "zod";
import React from "react";
import { isValidPhoneNumber } from "react-phone-number-input";

import { CATEGORIES_QUERYResult } from "@/sanity.types";
import { Container } from "@/components/shared/container";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Notify } from "@/components/shared/notify";
import { toast } from "sonner";
import { Input } from "@/ui/input";
import { PhoneInput } from "@/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Textarea } from "@/ui/textarea";
import { Button } from "@/ui/button";
import { Icons } from "hugeicons-proxy";
import { env } from "@/lib/env";
import Link from "next/link";

export const contactFormSchema = z.object({
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
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  message: z
    .string("Message is required")
    .min(10, "At least 10 characters long")
    .max(1000, "At least 1000 characters long"),
});

export type ContactFormSchemaType = z.infer<typeof contactFormSchema>;

interface Props {
  categories: CATEGORIES_QUERYResult;
}

export const ContactFormComp: React.FC<Props> = ({ categories }) => {
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const form = useForm<ContactFormSchemaType>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fName: "",
      lName: "",
      email: "",
      inquiryType: categories[0]?.slug || "Others",
      phone: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactFormSchemaType) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (result.success) {
        toast.custom(() => (
          <Notify
            type="success"
            title={`Message has been sent, ${values.fName}`}
          />
        ));
        form.reset();
      } else {
        toast.custom(() => (
          <Notify
            type="error"
            title="Something went wrong"
            description={result.error}
          />
        ));
      }
    } catch (error) {
      toast.custom(() => (
        <Notify
          type="error"
          title="Something went wrong"
          description={
            error instanceof Error ? error.message : "Failed to send message"
          }
        />
      ));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex-1 overflow-x-clip">
      <Container size="sm" className="md:py-8 lg:py-16">
        <div className="flex w-full flex-col-reverse overflow-hidden border shadow-xs md:flex-row">
          <div className="bg-foreground flex w-full flex-col gap-6 p-6 md:w-5/12 md:p-8 xl:p-12">
            <div className="flex flex-col">
              <h2 className="text-background mb-1 font-serif text-xl md:text-2xl">
                Get in touch
              </h2>
              <p className="text-muted-foreground mb-8 text-sm font-normal">
                We&apos;re here to help with any questions or feedback.
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <Icons.Mail01Icon className="text-background size-5" />
                  <Link
                    href={`mailto:${env.NEXT_PUBLIC_RESEND_INFO_EMAIL}`}
                    target="_blank"
                    className="group flex flex-col gap-0.5"
                  >
                    <p className="text-background text-xs font-medium uppercase">
                      Support Email
                    </p>
                    <p className="text-muted-foreground group-hover:text-background text-sm group-hover:underline">
                      {env.NEXT_PUBLIC_RESEND_INFO_EMAIL}
                    </p>
                  </Link>
                </div>
                <div className="flex items-start gap-3">
                  <Icons.Contact02Icon className="text-background size-5" />
                  <Link
                    href="tel:+12029074865"
                    target="_blank"
                    className="group flex flex-col gap-0.5"
                  >
                    <p className="text-background text-xs font-medium uppercase">
                      Phone Number
                    </p>
                    <p className="text-muted-foreground group-hover:text-background text-sm group-hover:underline">
                      (+1) 202-907-4865
                    </p>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-2">
              <p className="text-background text-xs font-medium uppercase">
                Location
              </p>
              <div className="map-container h-48 overflow-hidden border md:h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12424.290919500167!2d-76.9167386!3d38.8765778!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b7bf25fe8ebc8d%3A0x8fb5f2e243a74c7e!2sCapitol%20Heights%2C%20MD%2020743%2C%20USA!5e0!3m2!1sen!2sng!4v1771208827328!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  loading="eager"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="bg-card flex-1 space-y-5 overflow-hidden p-6 md:p-8 xl:p-12"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your first name"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your last name"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email address"
                          type="email"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          defaultCountry="US"
                          placeholder="+1 (555) 000-0000"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="inquiryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What is this about?</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className="w-full"
                          aria-invalid={Boolean(
                            form.formState.errors.inquiryType,
                          )}
                          disabled={form.formState.isSubmitting || isSubmitting}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        {((categories.length > 0 &&
                          !form.formState.isSubmitting) ||
                          !isSubmitting) && (
                          <SelectContent>
                            <SelectGroup>
                              {categories.map(
                                (type: (typeof categories)[number]) => (
                                  <SelectItem key={type._id} value={type.slug!}>
                                    {type.name}
                                  </SelectItem>
                                ),
                              )}
                              <SelectItem value="others">Others</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        )}
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Write your message</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Tell us how we can help you.."
                        disabled={form.formState.isSubmitting || isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                size="xl"
                type="submit"
                className="w-full"
                loadingText="Please wait..."
                isLoading={form.formState.isSubmitting || isSubmitting}
              >
                <span>Continue</span>
              </Button>
            </form>
          </Form>
        </div>
      </Container>
    </div>
  );
};
