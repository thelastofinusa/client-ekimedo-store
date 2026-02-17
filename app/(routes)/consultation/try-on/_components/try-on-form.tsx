"use client";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";

import {
  bookingLocation,
  preferredPaymentMethod,
  preMadeDrConData,
  sizeFilters,
} from "@/lib/constants/consultation";
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
import { Textarea } from "@/ui/textarea";
import Image from "next/image";
import { Icons } from "hugeicons-proxy";
import { Badge } from "@/ui/badge";

const budgetOptions = {
  budget: {
    id: "budget",
    label: "Budget-Friendly",
    description: "Affordable and stylish options",
    priceRange: "Under $500",
    images: [
      "/collections/bridal.avif",
      "/collections/prom.avif",
      "/collections/special-events.avif",
    ],
  },
  "mid-range": {
    id: "mid-range",
    label: "Mid-Range",
    description: "Quality designs with variety",
    priceRange: "$500 - $1,500",
  },
  premium: {
    id: "premium",
    label: "Premium",
    description: "Designer collections",
    priceRange: "$1,500 - $3,000",
  },
  luxury: {
    id: "luxury",
    label: "Luxury",
    description: "Haute couture and custom designs",
    priceRange: "$3,000+",
  },
};

const formSchema = z
  .object({
    fName: z.string().min(2, "First name is required"),
    lName: z.string().min(2, "Last name is required"),
    email: z
      .email("Email is required")
      .min(2, "Email must be more than 2 char."),
    phone: z
      .string()
      .trim()
      .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
    eventDate: z.date(),
    consultationDate: z.date(),
    attendees: z.any(),
    location: z.string("Location is required").min(1, "Location is required"),
    dressSize: z
      .string("Dress size is required")
      .min(1, "Dress size is required"),
    dressColor: z
      .string("Dress color is required")
      .min(1, "Dress color is required"),
    requirements: z.string().optional(),

    budgetType: z.string().optional(),
    productionProcess: z.boolean().refine((val) => val === true, {
      message: "We need to be sure you understand",
    }),
  })
  .refine((data) => data.budgetType && data.budgetType.length > 0, {
    path: ["budgetType"],
    message: "Select a budget",
  });

type FormDataType = z.infer<typeof formSchema>;

interface Props {
  config: typeof preMadeDrConData;
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

export const TryOnForm: React.FC<Props> = ({ config }) => {
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
      budgetType: "",
      productionProcess: false,
      dressSize: "",
      dressColor: "",
      requirements: "",
    },
    shouldUnregister: false,
  });

  const budgetOptionsArray = Object.values(budgetOptions);
  const [selectedOptionIndex, setSelectedOptionIndex] = React.useState<
    number | null
  >(null);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
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

      if (values.budgetType) {
        formData.append("budgetType", values.budgetType);
      }

      if (values.dressSize) {
        formData.append("dressSize", values.dressSize);
      }

      if (values.dressColor) {
        formData.append("dressColor", values.dressColor);
      }

      if (values.requirements) {
        formData.append("requirements", values.requirements);
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        const errorMessage =
          (data && (data.error || data.message)) ||
          "Unable to process booking. Please try again.";
        throw new Error(errorMessage);
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

  const handlePrevious = React.useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (selectedOptionIndex === null) return;

      const images =
        (budgetOptionsArray[selectedOptionIndex] as { images?: string[] })
          .images ?? [];

      if (!images.length) return;

      setSelectedImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1,
      );
    },
    [budgetOptionsArray, selectedOptionIndex],
  );

  const handleNext = React.useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (selectedOptionIndex === null) return;

      const images =
        (budgetOptionsArray[selectedOptionIndex] as { images?: string[] })
          .images ?? [];

      if (!images.length) return;

      setSelectedImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1,
      );
    },
    [budgetOptionsArray, selectedOptionIndex],
  );

  const images =
    selectedOptionIndex !== null
      ? ((budgetOptionsArray[selectedOptionIndex] as { images?: string[] })
          .images ?? [])
      : [];

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
                        <SelectTrigger className="w-full">
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
              Dress Preferences
            </h2>
            <p className="text-muted-foreground mb-8 text-sm font-normal">
              Customize your bridal consultation experience
            </p>

            <FormField
              control={form.control}
              name="dressSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dress Size</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {sizeFilters.map((size) => {
                        const isSelected = field.value === size.value;
                        return (
                          <Button
                            key={size.value}
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            type="button"
                            className={cn(
                              "font-mono text-xs! font-normal tracking-normal",
                            )}
                            onClick={() => field.onChange(size.value)}
                          >
                            {size.name}
                          </Button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dressColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dress Color</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Ivory, Champagne, Blush"
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
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requirements (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Any special requirements or preference.."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="bg-card border-border mb-5 h-auto space-y-5 overflow-hidden rounded-md border p-6 shadow-xs md:p-8 xl:p-12">
            <h2 className="mb-1 font-serif text-xl md:text-2xl">
              Consultation Details
            </h2>
            <p className="text-muted-foreground mb-8 text-sm font-normal">
              Tell us about your vision and preferences
            </p>

            <FormField
              control={form.control}
              name="budgetType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Tier</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                      className="grid w-full grid-cols-1 gap-4"
                      disabled={isSubmitting}
                    >
                      {Object.entries(budgetOptions).map(
                        ([key, item], index) => (
                          <div key={index} className="flex items-start gap-3">
                            <FormLabel
                              htmlFor={item.id}
                              className={cn(
                                "border-input has-data-[state=checked]:border-primary has-focus-visible:border-ring has-focus-visible:ring-ring relative flex w-full cursor-pointer items-center justify-between gap-3 rounded-md border p-4 shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-2",
                                {
                                  "border-destructive":
                                    form.formState.errors.budgetType,
                                  "pointer-events-none opacity-50":
                                    isSubmitting,
                                },
                              )}
                            >
                              <div className="flex flex-col gap-1">
                                <p className="text-foreground text-sm font-medium capitalize">
                                  {item.label}
                                </p>
                                <p>{item.description}</p>
                                <Badge className="mt-2 w-max capitalize">
                                  {item.priceRange}
                                </Badge>
                              </div>
                              <RadioGroupItem
                                value={key}
                                id={item.id}
                                disabled={isSubmitting}
                              />
                            </FormLabel>

                            {"images" in item && item.images?.length && (
                              <Button
                                size="icon-xs"
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setSelectedOptionIndex(index);
                                  setSelectedImageIndex(0);
                                }}
                              >
                                <Icons.ViewIcon />
                              </Button>
                            )}
                          </div>
                        ),
                      )}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  disabled={isSubmitting}
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

      <AnimatePresence>
        {selectedOptionIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-foreground/95 fixed inset-0 z-100 flex items-center justify-center p-4 backdrop-blur-sm md:p-12"
            onClick={() => setSelectedOptionIndex(null)}
          >
            <Button
              size="icon-sm"
              variant="secondary"
              onClick={() => setSelectedOptionIndex(null)}
              className="absolute top-6 right-5 z-50 md:top-8 md:right-8"
            >
              <Icons.Cancel01Icon className="size-4.5" />
            </Button>

            {images.length > 1 && (
              <Button
                size="icon"
                variant="outline"
                className="hover:bg-background/80 absolute left-4 z-50 md:left-8"
                onClick={handlePrevious}
              >
                <Icons.ArrowLeft01Icon className="size-4" />
              </Button>
            )}

            {images.length > 1 && (
              <Button
                size="icon"
                variant="outline"
                className="hover:bg-background/80 absolute right-4 z-50 md:right-8"
                onClick={handleNext}
              >
                <Icons.ArrowRight01Icon className="size-4" />
              </Button>
            )}

            <motion.div
              key={selectedImageIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative flex h-[80vh] w-full max-w-6xl items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-full w-full">
                <Image
                  src={images[selectedImageIndex]}
                  alt={budgetOptionsArray[selectedOptionIndex!].label}
                  fill
                  className="object-contain"
                  priority
                  quality={100}
                />
              </div>

              <div className="absolute right-0 -bottom-16 left-0 text-center">
                <h2 className="font-sans text-lg text-white md:text-xl">
                  {budgetOptionsArray[selectedOptionIndex!].priceRange}
                </h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Form>
  );
};
