"use client";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  bookingLocation,
  consultationsData,
  preferredPaymentMethod,
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
import { Icons } from "hugeicons-proxy";
import { isValidPhoneNumber } from "react-phone-number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/ui/input-group";
import { Button } from "@/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { Checkbox } from "@/ui/checkbox";
import { PhoneInput } from "@/ui/phone-input";
import { Notify } from "@/components/shared/notify";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import Link from "next/link";

const budgetOptions = {
  budget: {
    id: "budget",
    label: "Budget-Friendly",
    description: "Affordable and stylish options",
    priceRange: "Under $500",
  },
  premium: {
    id: "premium",
    label: "Premium",
    description: "Designer collections",
    priceRange: "$1,500 - $3,000",
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

    budgetType: z.string().optional(),
    customBudget: z.string().optional(),
    productionProcess: z.boolean().refine((val) => val === true, {
      message: "We need to be sure you understand",
    }),
  })
  .refine(
    (data) =>
      (data.budgetType && data.budgetType.length > 0) ||
      (data.customBudget && data.customBudget.length > 0),
    {
      path: ["budgetType"],
      message: "Select a budget",
    },
  );

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

export const PromForm: React.FC<Props> = ({ config }) => {
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
      customBudget: "",
      productionProcess: false,
    },
    shouldUnregister: false,
  });

  const [showCustomBudget, setShowCustomBudget] = React.useState(false);
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

      if (values.customBudget) {
        formData.append("customBudget", values.customBudget);
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
                    <FormLabel>Wedding Date</FormLabel>
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
              Consultation Details
            </h2>
            <p className="text-muted-foreground mb-8 text-sm font-normal">
              Tell us about your vision and preferences
            </p>

            {showCustomBudget ? (
              <FormField
                control={form.control}
                name="customBudget"
                render={({ field: customField }) => (
                  <FormItem>
                    <FormLabel>Custom Budget Tier</FormLabel>
                    <FormControl>
                      <InputGroup
                        className={cn("h-12!", {
                          "border-destructive":
                            form.formState.errors.budgetType,
                        })}
                      >
                        <InputGroupInput
                          placeholder="Enter your budget (e.g. $2,500)"
                          autoComplete="off"
                          disabled={isSubmitting}
                          {...customField}
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            size="icon-xs"
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => {
                              form.setValue("budgetType", "");
                              form.setValue("customBudget", "");
                              setShowCustomBudget(false);
                            }}
                          >
                            <Icons.Cancel01Icon />
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="budgetType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Tier</FormLabel>
                    <FormControl>
                      <RadioGroup
                        className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2"
                        onValueChange={(value) => {
                          field.onChange(value);
                          setShowCustomBudget(value === "custom");
                        }}
                        disabled={isSubmitting}
                        value={field.value}
                      >
                        {Object.entries(budgetOptions).map(([key, item]) => (
                          <FormLabel
                            htmlFor={item.id}
                            key={key}
                            className={cn(
                              "border-input has-data-[state=checked]:border-primary has-focus-visible:border-ring has-focus-visible:ring-ring relative flex w-full cursor-pointer items-start gap-3 rounded-md border p-3 shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-2",
                              {
                                "border-destructive":
                                  form.formState.errors.budgetType,
                                "pointer-events-none opacity-50": isSubmitting,
                              },
                            )}
                          >
                            <RadioGroupItem
                              value={key}
                              id={item.id}
                              disabled={isSubmitting}
                            />

                            <div className="text-foreground flex flex-1 flex-col items-start gap-2">
                              <div className="flex w-full items-center justify-between">
                                <span className="text-[11px]">
                                  {item.label}
                                </span>
                                <span className="text-muted-foreground text-[11px] font-medium">
                                  {item.priceRange}
                                </span>
                              </div>
                              <p className="text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </FormLabel>
                        ))}
                        <FormLabel
                          htmlFor={`budget-custom`}
                          className={cn(
                            "border-input has-data-[state=checked]:border-primary has-focus-visible:border-ring has-focus-visible:ring-ring relative flex w-full cursor-pointer items-start gap-3 rounded-md border p-3 shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-2 sm:col-span-2 md:col-span-1 lg:col-span-2",
                            {
                              "border-destructive":
                                form.formState.errors.budgetType,
                              "pointer-events-none opacity-50": isSubmitting,
                            },
                          )}
                        >
                          <RadioGroupItem
                            value="custom"
                            id={`budget-custom`}
                            disabled={isSubmitting}
                          />

                          <div className="text-foreground flex flex-1 flex-col items-start gap-2">
                            <div className="flex w-full items-center justify-between">
                              <span className="text-[11px]">Custom</span>
                            </div>
                            <p className="text-muted-foreground">
                              Custom budget let&apos;s you add your own budget
                            </p>
                          </div>
                        </FormLabel>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                        "border-input has-data-[state=checked]:border-primary has-focus-visible:border-ring has-focus-visible:ring-ring relative flex w-full cursor-pointer items-start gap-2 border p-5 shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-2",
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
