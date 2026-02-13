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
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneInput } from "@/ui/phone-input";
import { Button } from "@/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Notify } from "@/components/shared/notify";
import { Icons } from "hugeicons-proxy";
import {
  inquireFormSchema,
  type InquireFormSchemaType,
} from "@/lib/validators/inquire-form";

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
      eventDate: undefined,
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

      const response = await fetch("/api/inquire", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

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
                      <FormControl>
                        <Input
                          type="date"
                          disabled={isSubmitting}
                          min={new Date().toISOString().split("T")[0]}
                          value={
                            field.value instanceof Date &&
                            !isNaN(field.value.getTime())
                              ? field.value.toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) => {
                            const dateStr = e.target.value;
                            if (dateStr) {
                              const [year, month, day] = dateStr
                                .split("-")
                                .map(Number);
                              const date = new Date(year, month - 1, day);
                              field.onChange(date);
                            } else {
                              field.onChange(undefined);
                            }
                          }}
                        />
                      </FormControl>
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
