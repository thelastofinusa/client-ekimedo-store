"use client";
import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValidPhoneNumber } from "react-phone-number-input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { Container } from "@/components/shared/container";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Textarea } from "@/ui/textarea";
import { PhoneInput } from "@/ui/phone-input";

const inquiryTypes = [
  "General Inquiry",
  "Bridal Consultation",
  "Prom Design",
  "Special Event",
] as const;

const formSchema = z.object({
  fName: z
    .string("First name is required")
    .min(2, "First name too short")
    .max(50, "First name too long"),
  lName: z
    .string("Last name is required")
    .min(2, "Last name too short")
    .max(50, "Last name too long"),
  email: z.email("Email address is required").min(4, "Invalid email address"),
  inquiryType: z.enum(inquiryTypes, "Select an inquiry type"),
  phone: z
    .string("Phone number is required")
    .min(2, "Phone number is required")
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  message: z
    .string("Message is required")
    .min(10, "Message too short")
    .max(1000, "Message too long"),
});

type FormType = z.infer<typeof formSchema>;
export const ContactFormComp = () => {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fName: "",
      lName: "",
      email: "",
      inquiryType: inquiryTypes[0],
      phone: "",
      message: "",
    },
  });

  function onSubmit(values: FormType) {
    console.log(values);
  }

  return (
    <div className="py-24 lg:py-32">
      <Container size="sm">
        <div className="grid grid-cols-1 gap-8 py-16 sm:gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
          <div className="flex flex-col gap-10 md:gap-16">
            <header>
              <span className="text-muted-foreground mb-4 text-[10px] tracking-[0.4em] uppercase md:mb-6">
                Get in touch
              </span>
              <h2 className="font-serif text-5xl md:text-7xl">Inquire</h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed opacity-60 md:mt-8">
                Whether you have a specific vision or are just beginning your
                journey, our atelier is ready to assist you.
              </p>
            </header>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
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
                      <FormLabel>Inquiry Type</FormLabel>
                      <FormControl>
                        <Select
                          defaultValue={inquiryTypes[0]}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {inquiryTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
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
                          <PhoneInput {...field} defaultCountry="US" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="xl" className="w-full">
                  <span>Continue</span>
                </Button>
              </form>
            </Form>
          </div>

          <div className="flex flex-col gap-6 pt-12 md:pt-32 lg:gap-8">
            <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
              <div className="flex flex-col gap-2">
                <h4 className="text-[10px] tracking-[0.4em] uppercase">
                  The Atelier
                </h4>
                <h4 className="text-lg">
                  Capital Heights <br /> Maryland USA
                </h4>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-[10px] tracking-[0.4em] uppercase">
                  Contact Info
                </h4>
                <h4 className="text-lg">
                  (+1) 202-907-4865 <br /> info.e22fashion@gmail.com
                </h4>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-[10px] tracking-[0.4em] uppercase">
                  Business Hours
                </h4>
                <h4 className="text-lg">
                  Mon - Fri: 10:00 AM - 06:00 PM <br />
                  Sat - Sun: Closed
                </h4>
              </div>
            </div>

            <div className="bg-secondary relative aspect-video overflow-hidden shadow-xs transition-all duration-300">
              <Image
                src="https://images.unsplash.com/photo-1549488497-94b52bddac5d?q=80&w=2670&auto=format&fit=crop"
                alt="Location"
                className="absolute inset-0 h-auto w-full object-cover opacity-60"
                width={2670}
                height={0}
                priority
                quality={100}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
