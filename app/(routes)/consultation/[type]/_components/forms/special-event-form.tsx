"use client";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { consultationsData } from "@/lib/constants/consultation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { toast } from "sonner";
import { Input } from "@/ui/input";
import { Icons } from "hugeicons-proxy";
import { isValidPhoneNumber } from "react-phone-number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Button } from "@/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { Checkbox } from "@/ui/checkbox";
import { PhoneInput } from "@/ui/phone-input";
import { Notify } from "@/components/shared/notify";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import Link from "next/link";

const bookingLocation = [
  {
    value: "virtual",
    label: "Virtual (Zoom/Google Meet)",
  },
  { value: "in-person", label: "In-Person (Showroom)" },
];

const preferredPaymentMethod = [
  {
    id: "stripe",
    label: "Credit Card (Stripe)",
    icon: Icons.StripeIcon,
    description: "Fast, secure card payment.",
  },
  {
    id: "paypal",
    label: "PayPal",
    icon: Icons.PaypalIcon,
    description: "Quick checkout with PayPal.",
  },
];

const formSchema = z.object({
  fName: z.string().min(2, "First name is required"),
  lName: z.string().min(2, "Last name is required"),
  email: z.email("Email is required").min(2, "Email must be more than 2 char."),
  phone: z
    .string()
    .trim()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  eventDate: z.date(),
  consultationDate: z.date(),
  attendees: z.any(),
  location: z.string("Location is required").min(1, "Location is required"),

  productionProcess: z.boolean().refine((val) => val === true, {
    message: "We need to be sure you understand",
  }),
});

type FormDataType = z.infer<typeof formSchema>;

interface Props {
  config: (typeof consultationsData)[number];
}

const formatDateTimeLocal = (date?: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "";
  }
  const pad = (value: number) => String(value).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const parseDateTimeLocal = (value: string): Date | undefined => {
  if (!value) return undefined;
  const date = new Date(value);
  if (isNaN(date.getTime())) return undefined;
  return date;
};

export const SpecialEventForm: React.FC<Props> = ({ config }) => {
  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fName: "",
      lName: "",
      email: "",
      phone: "",
      eventDate: new Date(),
      consultationDate: new Date(),
      attendees: 1,
      location: bookingLocation[0].value,
      productionProcess: false,
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [inspirationPhotos, setInspirationPhotos] = React.useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = React.useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] =
    React.useState<(typeof preferredPaymentMethod)[number]["id"]>("stripe");
  const [bookedDates, setBookedDates] = React.useState<Date[]>([]);

  React.useEffect(() => {
    let isMounted = true;
    fetch("/api/bookings/dates")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: unknown) => {
        if (!isMounted) return;
        if (!Array.isArray(data)) return;
        const parsed = data
          .map((value) => {
            const date = new Date(value as string);
            return isNaN(date.getTime()) ? null : date;
          })
          .filter((d): d is Date => d !== null);
        setBookedDates(parsed);
      })
      .catch((error) => {
        console.error("Failed to load booked consultation dates", error);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const isBooked = (date: Date | undefined) => {
    if (!date) return false;
    return bookedDates.some((booked) => booked.getTime() === date.getTime());
  };

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

  async function onSubmit(values: FormDataType) {
    setIsSubmitting(true);

    try {
      if (isBooked(values.consultationDate)) {
        toast.custom(() => (
          <Notify
            type="error"
            title="Time unavailable"
            description="This consultation time is already booked. Please choose another slot."
          />
        ));
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      inspirationPhotos.forEach((file) => {
        formData.append("inspirationPhotos", file);
      });

      const fullName = `${values.fName} ${values.lName}`.trim();

      formData.append("serviceType", config.slug);
      formData.append("groupSize", String(values.attendees || 1));
      formData.append("dateTime", values.consultationDate.toISOString());
      formData.append("eventDate", values.eventDate.toISOString());
      formData.append("customerName", fullName);
      formData.append("customerEmail", values.email);
      formData.append("customerPhone", values.phone);
      formData.append("location", values.location);
      formData.append(
        "understoodProductionProcess",
        values.productionProcess ? "true" : "false",
      );
      formData.append("paymentMethod", paymentMethod);

      const response = await fetch("/api/bookings", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message || "Unable to process booking. Please try again.",
        );
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      toast.custom(() => (
        <Notify
          type="success"
          title={`${config.title} Submitted`}
          description="Your booking has been received."
        />
      ));

      form.reset();
      setInspirationPhotos([]);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
    } catch (error) {
      toast.custom(() => (
        <Notify
          type="error"
          title="Submission Failed"
          description={
            error instanceof Error
              ? error.message
              : "An unexpected error occurred. Please try again later."
          }
        />
      ));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8"
      >
        <div className="columns-1 gap-4 space-y-4 md:columns-2 md:gap-5">
          <div className="bg-card border-border mb-5 h-auto space-y-5 overflow-hidden rounded-md border p-6 shadow-xs md:p-8 xl:p-12">
            <h2 className="mb-1 font-serif text-xl md:text-2xl">
              Personal Information
            </h2>
            <p className="text-muted-foreground mb-8 text-sm font-normal">
              We need your contact details to reach you about your consultation
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
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

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
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

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Date</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        disabled={isSubmitting}
                        min={formatDateTimeLocal(new Date())}
                        value={formatDateTimeLocal(field.value)}
                        onChange={(e) => {
                          const date = parseDateTimeLocal(e.target.value);
                          field.onChange(date);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="attendees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bringing anyone with you?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1 Person"
                        type="number"
                        min={1}
                        max={5}
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking Location Preference</FormLabel>
                  <FormControl>
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
                          <SelectValue placeholder="Select location preference" />
                        </SelectTrigger>
                      </FormControl>

                      {!isSubmitting && (
                        <SelectContent>
                          {bookingLocation.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
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
              name="consultationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pick a date for the consultation</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      disabled={isSubmitting}
                      min={formatDateTimeLocal(new Date())}
                      value={formatDateTimeLocal(field.value)}
                      onChange={(e) => {
                        const date = parseDateTimeLocal(e.target.value);
                        if (date && isBooked(date)) {
                          toast.custom(() => (
                            <Notify
                              type="error"
                              title="Time unavailable"
                              description="This consultation time is already booked. Please choose another slot."
                            />
                          ));
                          field.onChange(undefined);
                          return;
                        }
                        field.onChange(date);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="bg-card border-border mb-5 h-auto space-y-5 overflow-hidden rounded-md border p-6 shadow-xs md:p-8 xl:p-12">
            <h2 className="mb-1 font-serif text-xl md:text-2xl">
              Preparation & Inspiration
            </h2>
            <p className="text-muted-foreground mb-8 text-sm font-normal">
              Confirm your readiness and share your style references.
            </p>

            <FormField
              control={form.control}
              name="productionProcess"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Have you read our FAQ for Production process?
                  </FormLabel>
                  <FormControl>
                    <div className="grid w-full grid-cols-1">
                      <FormLabel
                        htmlFor="productionProcess"
                        className={cn(
                          "border-input has-data-[state=checked]:border-primary has-focus-visible:border-ring has-focus-visible:ring-ring relative flex w-full items-start gap-3 rounded-md border p-3 shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-2",
                          {
                            "border-destructive":
                              form.formState.errors.productionProcess,
                            "pointer-events-none opacity-50": isSubmitting,
                          },
                        )}
                      >
                        <Checkbox
                          checked={field.value || false}
                          onCheckedChange={field.onChange}
                          id="productionProcess"
                          disabled={isSubmitting}
                        />

                        <div className="text-foreground flex cursor-pointer flex-col items-start gap-2">
                          <div className="flex w-full items-center justify-between">
                            <span className="text-[11px]">Yes, I have</span>
                          </div>
                          <p className="text-muted-foreground">
                            I understand the production timeline and process.
                          </p>
                        </div>
                      </FormLabel>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <Link href="/contact#productionProcess" className="mt-2">
                    <FormDescription className="font-medium underline">
                      Click here to see production process
                    </FormDescription>
                  </Link>
                </FormItem>
              )}
            />

            <div className="flex flex-col">
              <FormLabel>Style Inspiration Photos</FormLabel>

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
                  <Icons.ImageUploadIcon className="text-muted-foreground size-6" />
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
                  className={cn("mt-4 grid grid-cols-3 gap-3 md:grid-cols-5", {
                    "pointer-events-none opacity-50": isSubmitting,
                  })}
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
          </div>

          <div className="mb-5 flex flex-col gap-5">
            <div className="bg-card border-border h-auto space-y-5 overflow-hidden rounded-md border p-6 shadow-xs md:p-8 xl:p-12">
              <h2 className="mb-1 font-serif text-xl md:text-2xl">
                Payment Method
              </h2>
              <p className="text-muted-foreground mb-8 text-sm font-normal">
                Booking fee of <strong>{formatPrice(config.price)}</strong> is{" "}
                <strong>Nonrefundable!</strong>
              </p>

              <div className="grid gap-1">
                <RadioGroup
                  className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2"
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value)}
                >
                  {preferredPaymentMethod.map((method) => (
                    <FormLabel
                      htmlFor={method.id}
                      key={method.id}
                      className={cn(
                        "border-input has-data-[state=checked]:border-primary has-focus-visible:border-ring has-focus-visible:ring-ring relative flex w-full cursor-pointer items-start gap-2 rounded-md border p-5 shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-2",
                        {
                          "border-destructive": !paymentMethod,
                          "pointer-events-none opacity-50": isSubmitting,
                        },
                      )}
                    >
                      <RadioGroupItem
                        value={method.id}
                        id={method.id}
                        className="sr-only"
                        disabled={isSubmitting}
                      />
                      <div className="text-foreground flex flex-col items-start gap-2">
                        <div className="flex w-full items-center gap-2">
                          <method.icon className="size-4" />
                          <span className="text-[11px]">{method.label}</span>
                        </div>
                        <p className="text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                    </FormLabel>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <Button
              size="xl"
              isLoading={isSubmitting}
              loadingText="Processing Payment..."
            >
              Proceed to payment - {formatPrice(config.price)}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
