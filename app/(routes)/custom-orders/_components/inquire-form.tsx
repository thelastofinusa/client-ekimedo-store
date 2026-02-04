"use client";
import React from "react";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/ui/select";
import { Container } from "@/components/shared/container";
import { useForm } from "react-hook-form";
import z from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneInput } from "@/ui/phone-input";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { Button } from "@/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/ui/calendar";
import { toast } from "sonner";
import { Notify } from "@/components/shared/notify";
import { format } from "date-fns";
import { Icons } from "hugeicons-proxy";
import { submitInquiry } from "@/lib/actions/inquire";

const EVENT_TYPES = [
  { value: "wedding", label: "Wedding" },
  { value: "prom", label: "Prom" },
  { value: "reception", label: "Reception" },
  { value: "special-occasion", label: "Special Occasion" },
];

const BUDGET_RANGES = [
  { value: "under-500", label: "Under $500" },
  { value: "500-1000", label: "$500 - $1,000" },
  { value: "1000-2500", label: "$1,000 - $2,500" },
  { value: "2500-5000", label: "$2,500 - $5,000" },
  { value: "over-5000", label: "$5,000+" },
];

const inquireFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  email: z
    .email("Please enter a valid email address")
    .trim()
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  eventType: z.string().min(1, "Please select an event type"),
  eventDate: z.date("Please select an event date"),
  budget: z.string().min(1, "Please select an estimated budget"),
  dreamDress: z
    .string()
    .trim()
    .min(20, "Please describe your dream dress in at least 20 characters")
    .max(2000, "Description must be less than 2000 characters"),
});

type InquireFormSchemaType = z.infer<typeof inquireFormSchema>;

export const InquireForm = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [inspirationPhotos, setInspirationPhotos] = React.useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = React.useState<string[]>([]);

  const form = useForm<InquireFormSchemaType>({
    resolver: zodResolver(inquireFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      eventType: "",
      budget: "",
      dreamDress: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isUnder10MB = file.size <= 10 * 1024 * 1024;
      return isImage && isUnder10MB;
    });

    if (validFiles.length + inspirationPhotos.length > 5) {
      toast.custom(() => (
        <Notify
          type="error"
          title="Too many files"
          description="You can upload a maximum of 5 inspiration photos"
        />
      ));
      return;
    }

    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));
    setInspirationPhotos((prev) => [...prev, ...validFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setInspirationPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(values: InquireFormSchemaType) {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("eventType", values.eventType);
      formData.append("eventDate", values.eventDate.toISOString());
      formData.append("budget", values.budget);
      formData.append("dreamDress", values.dreamDress);

      inspirationPhotos.forEach((file) => {
        formData.append("inspirationPhotos", file);
      });

      const result = await submitInquiry(formData);

      if (result.success) {
        console.log("Custom order submitted:", {
          ...values,
          inspirationPhotos,
        });
        toast.custom(() => (
          <Notify
            type="success"
            title="Inquiry Submitted!"
            description="Thank you for your custom order inquiry. We will get back to you within 24-48 hours."
          />
        ));

        form.reset();
        setInspirationPhotos([]);
        previewUrls.forEach((url) => URL.revokeObjectURL(url));
        setPreviewUrls([]);
      } else {
        toast.custom(() => (
          <Notify
            type="error"
            title="Submission Failed"
            description={result.error || "Please try again later."}
          />
        ));
      }
    } catch (error) {
      toast.custom(() => (
        <Notify
          type="error"
          title="Submission Failed"
          description="An unexpected error occurred. Please try again later."
        />
      ));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-card py-24 lg:py-32">
      <Container size="xs" className="max-w-3xl">
        <div className="bg-card border-border rounded-md border p-6 shadow-xs md:p-8 lg:p-12">
          <h2 className="mb-1 text-center font-serif text-xl md:text-2xl">
            Tell Us About Your Vision
          </h2>
          <p className="text-muted-foreground mb-8 text-center text-sm font-normal">
            Fill out the form below and we&apos;ll be in touch to discuss your
            custom creation.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email & Phone */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
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
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Event Type & Date */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="eventType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="w-full"
                            disabled={isSubmitting}
                          >
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                        </FormControl>
                        {!isSubmitting && (
                          <SelectContent>
                            {EVENT_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        )}
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Event Date</FormLabel>
                      <Popover>
                        <PopoverTrigger disabled={isSubmitting}>
                          <FormControl>
                            <div
                              className={cn(
                                "text-foreground border-input/40 bg-card inline-flex h-12 w-full cursor-pointer items-center border px-4 text-sm shadow-xs",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </div>
                          </FormControl>
                        </PopoverTrigger>
                        {!isSubmitting && (
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              autoFocus
                              className="pointer-events-auto p-3"
                            />
                          </PopoverContent>
                        )}
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Budget */}
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Budget</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          <SelectValue placeholder="Select your budget range" />
                        </SelectTrigger>
                      </FormControl>
                      {!isSubmitting && (
                        <SelectContent>
                          {BUDGET_RANGES.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      )}
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Inspiration Photos */}
              <div className="flex flex-col">
                <FormLabel>Inspiration Photos</FormLabel>

                <div className="border-border hover:border-accent/50 mt-1 rounded-lg border-2 border-dashed p-6 text-center transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isSubmitting}
                    id="inspiration-photos"
                  />
                  <label
                    htmlFor="inspiration-photos"
                    className="flex cursor-pointer flex-col items-center gap-2"
                  >
                    <Icons.ImageUploadIcon className="text-muted-foreground h-8 w-8" />
                    <span className="text-muted-foreground text-sm">
                      Click to upload or drag and drop
                    </span>
                  </label>
                </div>
                <p className="text-muted-foreground mt-2 text-[10px] tracking-widest uppercase">
                  Upload up to 5 images that inspire your dream dress (max 10MB
                  each)
                </p>

                {/* Preview Grid */}
                {previewUrls.length > 0 && (
                  <div
                    className={cn(
                      "mt-4 grid grid-cols-3 gap-3 md:grid-cols-5",
                      {
                        "pointer-events-none opacity-50": isSubmitting,
                      },
                    )}
                  >
                    {previewUrls.map((url, index) => (
                      <div
                        key={index}
                        className="group relative aspect-square overflow-hidden rounded-lg"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Inspiration ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <Button
                          type="button"
                          size="icon-xs"
                          variant="destructive"
                          onClick={() => removePhoto(index)}
                          disabled={isSubmitting}
                          className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Icons.Cancel01Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dream Dress Description */}
              <FormField
                control={form.control}
                name="dreamDress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe Your Dream Dress</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isSubmitting}
                        placeholder="Tell us about your dream dress... Include details like style, silhouette, fabric preferences, neckline, embellishments, and any other specifics you have in mind."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isSubmitting}
                loadingText="Submitting..."
              >
                Submit Inquiry
              </Button>
            </form>
          </Form>
        </div>
      </Container>
    </div>
  );
};
