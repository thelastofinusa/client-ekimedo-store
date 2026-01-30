"use client";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
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
import { PhoneInput } from "@/ui/phone-input";
import { Notify } from "@/components/shared/notify";
import {
  formSchema,
  FormType,
  inquiryTypes,
} from "@/lib/validators/contact-form";
import { sendContactMessage } from "@/lib/actions/contact";

export const ContactFormComp = () => {
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fName: "",
      lName: "",
      email: "",
      inquiryType: "" as (typeof inquiryTypes)[number],
      phone: "",
      message: "",
    },
  });

  async function onSubmit(values: FormType) {
    const result = await sendContactMessage({
      fName: values.fName,
      lName: values.lName,
      email: values.email,
      inquiryType: values.inquiryType,
      phone: values.phone,
      message: values.message,
    });

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
                className="flex flex-col gap-4 md:gap-6"
              >
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 md:gap-6 lg:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            disabled={form.formState.isSubmitting}
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
                            {...field}
                            type="text"
                            disabled={form.formState.isSubmitting}
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
                      <FormLabel>Inquiry Type</FormLabel>
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
                            disabled={form.formState.isSubmitting}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          {!form.formState.isSubmitting && (
                            <SelectContent>
                              <SelectGroup>
                                {inquiryTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          )}
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 md:gap-6 lg:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            disabled={form.formState.isSubmitting}
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
                            {...field}
                            defaultCountry="US"
                            disabled={form.formState.isSubmitting}
                          />
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
                        <Textarea
                          {...field}
                          disabled={form.formState.isSubmitting}
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
                  isLoading={form.formState.isSubmitting}
                >
                  <span>Send Inquiry</span>
                </Button>
              </form>
            </Form>
          </div>

          <div className="flex flex-col gap-8 pt-12 md:pt-32 lg:gap-16">
            <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
              <div className="flex flex-col gap-3">
                <p className="text-[10px] tracking-[0.4em] uppercase">
                  The Atelier
                </p>
                <Link
                  target="_blank"
                  className="w-max font-serif text-lg hover:underline"
                  href="https://maps.app.goo.gl/8d2LfPehk2PMqN5Q8"
                >
                  <p>Capital Heights</p>
                  <p>Maryland USA</p>
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-[10px] tracking-[0.4em] uppercase">
                  Contact Info
                </p>
                <Link
                  target="_blank"
                  className="w-max font-serif text-lg hover:underline"
                  href="tel:+12029074865"
                >
                  <p>(+1) 202-907-4865</p>
                  <p>info.e22fashion@gmail.com</p>
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-[10px] tracking-[0.4em] uppercase">
                  Business Hours
                </p>
                <h4 className="w-max font-serif text-lg">
                  <p>Tuesday to Saturday: 10:00 AM to 6:00 PM.</p>
                  <p>Sunday and Monday: Closed.</p>
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
