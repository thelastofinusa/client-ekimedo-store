"use client";
import { z } from "zod";
import Image from "next/image";
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

const inquiryTypes = [
  "General Inquiry",
  "Bridal Consultation",
  "Prom Design",
  "Special Event",
] as const;

const formSchema = z.object({
  fName: z
    .string()
    .min(2, "First name too short")
    .max(50, "First name too long"),
  lName: z.string().min(2, "Last name too short").max(50, "Last name too long"),
  email: z.email("Invalid email address"),
  inquiryType: z.enum(inquiryTypes, "Select an inquiry type"),
  phone: z
    .string()
    .min(7, "Phone number too short")
    .max(20, "Phone number too long"),
  message: z
    .string()
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
          <div className="flex flex-col gap-16">
            <header>
              <span className="text-muted-foreground mb-6 text-[10px] tracking-[0.4em] uppercase">
                Get in touch
              </span>
              <h2 className="font-serif text-5xl md:text-7xl">Inquire</h2>
              <p className="mt-8 max-w-md text-sm leading-relaxed opacity-60">
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
                          <Input {...field} />
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
                  Submit
                </Button>
              </form>
            </Form>
          </div>

          <div className="space-y-24 pt-12 md:pt-32">
            <div className="space-y-12">
              <div className="space-y-4">
                <h4 className="text-[10px] tracking-[0.4em] uppercase opacity-60">
                  The Atelier
                </h4>
                <p className="font-serif text-xl">Capital Heights Maryland</p>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] tracking-[0.4em] uppercase opacity-60">
                  Contact Info
                </h4>
                <p className="font-serif text-xl">
                  202-907-4865 <br /> info.e22fashion@gmail.com
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] tracking-[0.4em] uppercase opacity-60">
                  Business Hours
                </h4>
                <p className="font-serif text-xl">
                  Mon - Fri: 10:00 AM - 06:00 PM <br />
                  Sat - Sun: Closed
                </p>
              </div>
            </div>

            <div className="bg-secondary relative aspect-video overflow-hidden shadow-xs grayscale transition-all duration-300 hover:grayscale-0">
              <Image
                src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1000&auto=format&fit=crop"
                alt="Location"
                className="absolute inset-0 h-full w-full object-cover opacity-60"
                fill
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
