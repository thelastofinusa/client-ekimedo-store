"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import z from "zod";
import React from "react";
import { useDropzone } from "react-dropzone";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Input } from "@/ui/input";
import { PhoneInput } from "@/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Textarea } from "@/ui/textarea";
import { Button } from "@/ui/button";
import { Icons } from "hugeicons-proxy";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/ui/input-group";
import { Checkbox } from "@/ui/checkbox";

interface FormFieldDef {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "textarea"
    | "select"
    | "number"
    | "date"
    | "checkbox";
  placeholder?: string;
  required?: boolean;
  options?: string[];
  errorMessage?: string;
  description?: string;
}

interface Service {
  slug: string | null;
  title: string | null;
  price: number | null;
  duration: number | null;
  formBuilder?: FormFieldDef[];
}

interface Props {
  service: Service;
}

interface Step {
  id: string;
  title: string;
  question: string;
  fields: string[];
  description?: string;
}

const baseBookingFormSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  groupSize: z
    .number("Group size is required")
    .min(1, "Must be at least 1")
    .max(10, "Must be at most 10"),
  date: z.date(),
  startTime: z.string().min(1, "Start time is required"),
  location: z.enum(["virtual", "in-person"], {
    message: "Please select a location",
  }),
  styleInspiration: z
    .array(z.custom<File>((val) => val instanceof File, "Please upload a file"))
    .min(1, "At least one style inspiration file is required")
    .max(5, "You can upload a maximum of 5 files")
    .refine(
      (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
      "Each file must be 5MB or less",
    ),
  socialMediaHandles: z.array(
    z.object({
      value: z.union([
        z.literal(""),
        z.url({ message: "Please enter a valid URL" }),
      ]),
    }),
  ),
  styleNotes: z.string().optional(),
  agreedToCancellation: z.boolean().refine((val) => val === true, {
    message: "You must agree to the cancellation policy",
  }),
});

export const BookingForm: React.FC<Props> = ({ service }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [bookedDates, setBookedDates] = React.useState<Date[]>([]);

  React.useEffect(() => {
    async function fetchBookedDates() {
      try {
        const response = await fetch("/api/bookings/dates");
        if (response.ok) {
          const dates = await response.json();
          setBookedDates(dates.map((date: string) => new Date(date)));
        }
      } catch (error) {
        console.error("Failed to fetch booked dates:", error);
      }
    }

    fetchBookedDates();
  }, []);

  const [currentStep, setCurrentStep] = React.useState(0);

  const formSchema = React.useMemo(() => {
    let schema: z.ZodObject<any, any> = baseBookingFormSchema;

    if (service.formBuilder) {
      service.formBuilder.forEach((field) => {
        let zField: z.ZodTypeAny;

        switch (field.type) {
          case "email":
            zField = z.email(field.errorMessage || "Invalid email");
            break;
          case "number":
            zField = z.coerce.number();
            break;
          case "checkbox":
            zField = z.boolean();
            break;
          case "date":
            // Date input usually returns a string "YYYY-MM-DD"
            zField = z.string();
            break;
          default:
            zField = z.string();
        }

        if (field.required) {
          if (field.type === "checkbox") {
            zField = (zField as z.ZodBoolean).refine(
              (val) => val === true,
              field.errorMessage || "Required",
            );
          } else if (field.type === "number") {
            zField = (zField as z.ZodNumber).min(
              1,
              field.errorMessage || "Required",
            );
          } else {
            zField = (zField as z.ZodString).min(
              1,
              field.errorMessage || "Required",
            );
          }
        } else {
          zField = zField.optional();
        }

        schema = schema.extend({ [field.name]: zField });
      });
    }
    return schema;
  }, [service.formBuilder]);

  type BookingFormSchemaType = any;

  const defaultValues = React.useMemo(() => {
    const defaults = {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      groupSize: 1,
      location: "virtual",
      socialMediaHandles: [{ value: "" }],
      agreedToCancellation: false,
      startTime: "",
      styleInspiration: [],
      styleNotes: "",
    };

    if (service.formBuilder) {
      service.formBuilder.forEach((field) => {
        if (field.type === "checkbox") {
          (defaults as any)[field.name] = false;
        } else {
          (defaults as any)[field.name] = "";
        }
      });
    }
    return defaults;
  }, [service.formBuilder]);

  const form = useForm<BookingFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues as any,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialMediaHandles",
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".svg", ".gif"],
    },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      form.setValue("styleInspiration", acceptedFiles, {
        shouldValidate: true,
      });
    },
  });

  const files = form.watch("styleInspiration") || [];

  const filesList = files.map((file: File) => (
    <li
      key={file.name}
      className="flex items-center justify-between rounded-md border p-3"
    >
      <div className="flex items-center space-x-3">
        <div className="bg-secondary/50 flex h-10 w-10 items-center justify-center rounded-md">
          <Icons.Image01Icon className="text-foreground h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm leading-none font-medium">{file.name}</p>
          <p className="text-muted-foreground text-xs">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </div>
    </li>
  ));

  const steps = React.useMemo(() => {
    const staticSteps: Step[] = [
      {
        id: "intro",
        title: "Let's get to know you",
        question: "What's your name, beautiful?",
        fields: ["customerName", "customerEmail"],
      },
      {
        id: "contact",
        title: "Contact Details",
        question: "How can we reach you?",
        fields: ["customerPhone", "groupSize"],
      },
      {
        id: "details",
        title: "Session Details",
        question: "When and where?",
        fields: ["location", "date", "startTime"],
      },
    ];

    const dynamicSteps: Step[] =
      service.formBuilder?.map((field) => ({
        id: field.name,
        title: field.label,
        question: field.label,
        fields: [field.name],
        description: field.description,
      })) || [];

    const finalSteps: Step[] = [
      {
        id: "socials",
        title: "Social Media",
        question: "Where can we find you online?",
        fields: ["socialMediaHandles"],
      },
      {
        id: "inspiration",
        title: "Style Inspiration",
        question: "Show us what you love",
        fields: ["styleInspiration", "styleNotes"],
      },
      {
        id: "review",
        title: "Review & Confirm",
        question: "Ready to book?",
        fields: ["agreedToCancellation"],
      },
    ];

    return [...staticSteps, ...dynamicSteps, ...finalSteps];
  }, [service.formBuilder]);

  const nextStep = async () => {
    const fields = steps[currentStep].fields;
    const isValid = await form.trigger(fields as any);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("serviceType", service.slug || "");
      formData.append("customerName", values.customerName);
      formData.append("customerEmail", values.customerEmail);
      formData.append("customerPhone", values.customerPhone);
      formData.append("groupSize", values.groupSize.toString());
      formData.append("location", values.location);

      if (values.date && values.startTime) {
        const [hours, minutes] = values.startTime.split(":");
        const dateTime = new Date(values.date);
        dateTime.setHours(parseInt(hours), parseInt(minutes));
        formData.append("dateTime", dateTime.toISOString());

        // Default duration 1 hour if not specified
        const duration = service.duration || 60;
        const endTime = new Date(dateTime);
        endTime.setMinutes(endTime.getMinutes() + duration);
        formData.append("endTime", endTime.toISOString());
      }

      if (values.socialMediaHandles) {
        values.socialMediaHandles.forEach((handle: { value: string }) => {
          if (handle.value) formData.append("socialMediaHandle", handle.value);
        });
      }

      if (values.styleInspiration) {
        values.styleInspiration.forEach((file: File) => {
          formData.append("styleInspiration", file);
        });
      }

      if (values.styleNotes) {
        formData.append("styleNotes", values.styleNotes);
      }

      formData.append(
        "agreedToCancellation",
        values.agreedToCancellation ? "true" : "false",
      );

      if (service.formBuilder) {
        service.formBuilder.forEach((field) => {
          if (values[field.name]) {
            formData.append(field.name, values[field.name]);
          }
        });
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.success("Booking request sent!");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card mx-auto w-full max-w-2xl rounded-md border p-6 shadow-xs md:p-8">
      <div className="mb-8">
        <div className="mb-6 flex items-center justify-between">
          {currentStep > 0 && (
            <Button
              variant="ghost"
              onClick={prevStep}
              className="pl-0 hover:bg-transparent"
            >
              <Icons.ArrowLeft01Icon className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          <span className="text-muted-foreground ml-auto text-xs font-medium tracking-wider uppercase">
            Step {currentStep + 1} of {steps.length} —{" "}
            {steps[currentStep].title}
          </span>
        </div>

        <h2 className="text-foreground mb-2 font-serif text-3xl leading-tight md:text-4xl">
          {steps[currentStep].question}
        </h2>
        {steps[currentStep].description && (
          <p className="text-muted-foreground mt-2 text-sm">
            {steps[currentStep].description}
          </p>
        )}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="min-h-[300px]">
            {/* Step 1: Intro */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Jane Doe"
                          disabled={isLoading}
                          className="focus-visible:border-primary rounded-none border-0 border-b bg-transparent px-0 shadow-none focus-visible:ring-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="jane@example.com"
                          disabled={isLoading}
                          className="focus-visible:border-primary rounded-none border-0 border-b bg-transparent px-0 shadow-none focus-visible:ring-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 2: Contact */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          defaultCountry="US"
                          placeholder="+1 (555) 000-0000"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="groupSize"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Number of people</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="2"
                          disabled={isLoading}
                          className="focus-visible:border-primary rounded-none border-0 border-b bg-transparent px-0 shadow-none focus-visible:ring-0"
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 3: Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Location Preference</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="virtual">
                            Virtual (Zoom/Google Meet)
                          </SelectItem>
                          <SelectItem value="in-person">
                            In-Person (Showroom)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Preferred Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            disabled={isLoading}
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
                                // Create date object from string (YYYY-MM-DD)
                                // We use simple string parsing to avoid timezone issues for the day
                                const [year, month, day] = dateStr
                                  .split("-")
                                  .map(Number);
                                const date = new Date(year, month - 1, day);
                                field.onChange(date);
                              } else {
                                field.onChange(undefined);
                              }
                            }}
                            className="focus-visible:border-primary rounded-none border-0 border-b bg-transparent px-0 shadow-none focus-visible:ring-0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              "09:00",
                              "10:00",
                              "11:00",
                              "13:00",
                              "14:00",
                              "15:00",
                              "16:00",
                            ].map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Dynamic Steps */}
            {currentStep >= 3 &&
              currentStep < 3 + (service.formBuilder?.length || 0) && (
                <div className="space-y-6">
                  {service.formBuilder?.map((fieldDef, index) => {
                    if (currentStep !== 3 + index) return null;
                    return (
                      <FormField
                        key={fieldDef.name}
                        control={form.control}
                        name={fieldDef.name as any}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="sr-only">
                              {fieldDef.label}
                            </FormLabel>
                            <FormControl>
                              {fieldDef.type === "textarea" ? (
                                <Textarea
                                  placeholder={fieldDef.placeholder}
                                  disabled={isLoading}
                                  {...field}
                                  value={field.value as string}
                                  className="min-h-[150px]"
                                />
                              ) : fieldDef.type === "select" ? (
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value as string}
                                  disabled={isLoading}
                                >
                                  <FormControl>
                                    <SelectTrigger
                                      className="w-full"
                                      disabled={isLoading}
                                    >
                                      <SelectValue
                                        placeholder={
                                          fieldDef.placeholder ||
                                          "Select option"
                                        }
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {fieldDef.options?.map((opt) => (
                                      <SelectItem key={opt} value={opt}>
                                        {opt}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : fieldDef.type === "checkbox" ? (
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    checked={!!field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isLoading}
                                  />
                                  <span className="text-muted-foreground text-sm">
                                    {fieldDef.placeholder || fieldDef.label}
                                  </span>
                                </div>
                              ) : (
                                <Input
                                  type={fieldDef.type}
                                  placeholder={fieldDef.placeholder}
                                  disabled={isLoading}
                                  {...field}
                                  value={
                                    field.value as string | number | undefined
                                  }
                                  className="focus-visible:border-primary rounded-none border-0 border-b bg-transparent px-0 shadow-none focus-visible:ring-0"
                                  onChange={(e) => {
                                    if (fieldDef.type === "number") {
                                      field.onChange(e.target.valueAsNumber);
                                    } else {
                                      field.onChange(e);
                                    }
                                  }}
                                />
                              )}
                            </FormControl>
                            {fieldDef.description && (
                              <FormDescription>
                                {fieldDef.description}
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  })}
                </div>
              )}

            {/* Socials Step */}
            {steps[currentStep].id === "socials" && (
              <div className="space-y-6">
                <div className="flex w-full flex-col gap-1">
                  <FormLabel className="flex items-center justify-between">
                    <span>Social Media Handles (Optional)</span>
                    <Icons.Add01Icon
                      className="size-4 cursor-pointer"
                      onClick={() => append({ value: "" })}
                    />
                  </FormLabel>
                  {fields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`socialMediaHandles.${index}.value`}
                      render={({ field: controlField }) => (
                        <FormItem className="mb-1 w-full last-of-type:mb-0">
                          <FormControl>
                            <InputGroup className="h-12 w-full">
                              <InputGroupInput
                                type="url"
                                placeholder="https://example.com/yourhandle"
                                {...controlField}
                                disabled={isLoading}
                              />
                              {fields.length > 1 && (
                                <InputGroupAddon align="inline-end">
                                  <InputGroupButton
                                    size="icon-sm"
                                    onClick={() => remove(index)}
                                  >
                                    <Icons.Cancel01Icon className="h-4 w-4 text-red-500" />
                                  </InputGroupButton>
                                </InputGroupAddon>
                              )}
                            </InputGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Inspiration Step */}
            {steps[currentStep].id === "inspiration" && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="styleInspiration"
                  render={() => (
                    <FormItem>
                      <FormLabel>Upload Images</FormLabel>
                      <FormControl>
                        <div
                          {...getRootProps()}
                          className={`border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed bg-transparent px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                            isDragActive ? "border-primary" : ""
                          }`}
                        >
                          <Input
                            {...getInputProps()}
                            className="hidden"
                            disabled={isLoading}
                          />
                          <Icons.CloudUploadIcon className="text-muted-foreground mb-4 h-10 w-10" />
                          <p className="text-muted-foreground text-center text-sm">
                            Drag & drop images here, or click to select
                          </p>
                          <p className="text-muted-foreground mt-2 text-xs">
                            Max 5 files, 5MB each
                          </p>
                        </div>
                      </FormControl>
                      <FormMessage />
                      {files.length > 0 && (
                        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                          {filesList}
                        </ul>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="styleNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description / Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us more about your style..."
                          className="focus-visible:border-primary min-h-[100px] resize-none rounded-none border-0 border-b bg-transparent px-0 shadow-none focus-visible:ring-0"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Review Step */}
            {steps[currentStep].id === "review" && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="agreedToCancellation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to the cancellation policy
                        </FormLabel>
                        <FormDescription>
                          Cancellations must be made at least 24 hours in
                          advance.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end pt-6">
            {currentStep < steps.length - 1 ? (
              <Button type="button" size="lg" onClick={nextStep}>
                Continue
              </Button>
            ) : (
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading ? "Processing..." : "Pay & Book"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
