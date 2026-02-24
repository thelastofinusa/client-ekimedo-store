"use client";
import React from "react";
import { z } from "zod";
import {
  ControllerRenderProps,
  FieldValues,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
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
import { Icons, IconRegistry } from "hugeicons-proxy";
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
  InputGroupInput,
  InputGroupTextarea,
} from "@/ui/input-group";
import { Button } from "@/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { Checkbox } from "@/ui/checkbox";
import { PhoneInput } from "@/ui/phone-input";
import { Notify } from "@/components/shared/notify";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import Link from "next/link";
import { Route } from "next";
import { Container } from "@/components/shared/container";
import { Label } from "@/ui/label";
import { Alert, AlertTitle } from "@/ui/alert";
import { AnimatePresence, motion, Variants } from "motion/react";
import Image from "next/image";

interface Props {
  config: (typeof consultationsData)[number];
}

type CheckboxInterest = {
  id: string;
  label: string;
  description?: string;
};

type CheckboxOption = {
  id: string;
  label: string;
  description?: string;
  interests?: CheckboxInterest[];
};

type CheckboxFieldConfig = {
  name: string;
  type: "checkbox";
  label: string;
  required?: boolean;
  errMsg?: string;
  defaultValue?: unknown;
  options: CheckboxOption[];
};

type FieldConfig =
  | {
      name: string;
      type: "text" | "email" | "tel" | "textarea";
      required?: boolean;
      defaultValue?: string;
      placeholder?: string;
      errMsg?: string;
      icons?: {
        start: { icon: keyof IconRegistry };
        end: { value: string };
      };
    }
  | {
      name: string;
      type: "number";
      required?: boolean;
      defaultValue?: number;
      placeholder?: string;
      min?: number;
      max?: number;
      errMsg?: string;
      icons?: {
        start: { icon: keyof IconRegistry };
        end: { value: string };
      };
    }
  | {
      name: string;
      type: "date" | "datetime-local";
      required?: boolean;
      defaultValue?: Date;
      errMsg?: string;
    }
  | {
      name: string;
      type: "select";
      required?: boolean;
      defaultValue?: string;
      placeholder?: string;
      options: { label: string; value: string }[];
      errMsg?: string;
    }
  | {
      name: string;
      type: "file";
      required?: boolean;
      defaultValue?: string;
      placeholder?: string;
      min?: number;
      max?: number;
      size: number;
      errMsg?: string;
    }
  | {
      name: string;
      type: "size";
      label: string;
      required?: boolean;
      errMsg?: string;
      defaultValue?: unknown;
      sizes: {
        name: string;
        value: string;
      }[];
    }
  | {
      name: string;
      type: "radio";
      label: string;
      required?: boolean;
      errMsg?: string;
      defaultValue?: string;
      items: {
        id: string;
        title: string;
        description: string;
        range: {
          from: number;
          to?: number;
        };
        images?: string[];
      }[];
    }
  | CheckboxFieldConfig;

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

const fieldToZod = (field: FieldConfig) => {
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case "text":
    case "size":
    case "textarea":
    case "select":
      schema = field.required ? z.string().min(2, field.errMsg) : z.string();
      break;

    case "tel": {
      const base = z
        .string()
        .trim()
        .refine(isValidPhoneNumber, {
          message: field.errMsg ?? "Invalid phone number",
        });
      schema = field.required ? base : base.optional();
      break;
    }

    case "email":
      schema = field.required ? z.email(field.errMsg) : z.email();
      break;

    case "number":
      schema = z.coerce.number();
      break;

    case "date":
    case "datetime-local":
      schema = z.coerce.date({
        error: field.errMsg ?? "Invalid date",
      });
      break;

    case "checkbox":
      schema = z.array(z.string());
      if (field.required) {
        schema = (schema as z.ZodArray<z.ZodString>).min(1, field.errMsg);
      }
      break;
    case "file": {
      let schema = z.array(z.instanceof(File));

      if (field.required) {
        const min = (field as { min?: number }).min ?? 1;
        schema = schema.min(min, field.errMsg);
      }

      return field.required ? schema : schema.optional();
    }

    default:
      schema = z.any();
  }

  if (field.required) {
    return schema;
  }

  return schema.optional();
};

const buildZodSchema = (formCards: readonly unknown[] | undefined) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  if (!Array.isArray(formCards)) {
    return z.object(shape);
  }

  formCards.forEach((card) => {
    const fields = (card as { fields?: FieldConfig[] }).fields;
    if (!Array.isArray(fields)) return;
    fields.forEach((field) => {
      if (!field || typeof field !== "object") return;
      if (!("name" in field) || !("type" in field)) return;
      shape[(field as FieldConfig).name] = fieldToZod(field as FieldConfig);
    });
  });

  return z.object(shape);
};

const buildDefaultValues = (formCards: readonly unknown[] | undefined) => {
  const defaults: Record<string, unknown> = {};

  if (!Array.isArray(formCards)) {
    return defaults;
  }

  formCards.forEach((card) => {
    const fields = (card as { fields?: FieldConfig[] }).fields;
    if (!Array.isArray(fields)) return;
    fields.forEach((field) => {
      if (!field || typeof field !== "object") return;
      if (!("name" in field) || !("type" in field)) return;
      const typedField = field as FieldConfig;

      if (typedField.defaultValue !== undefined) {
        defaults[typedField.name] = typedField.defaultValue;
        return;
      }

      switch (typedField.type) {
        case "number":
          defaults[typedField.name] = undefined;
          break;
        case "checkbox":
          defaults[typedField.name] = [];
          break;
        case "date":
        case "datetime-local":
          defaults[typedField.name] = undefined;
          break;
        case "file":
          defaults[typedField.name] = [];
          break;
        default:
          defaults[typedField.name] = "";
      }
    });
  });

  return defaults;
};

interface Props {
  config: (typeof consultationsData)[number];
}

export const BookingForm: React.FC<Props> = ({ config }) => {
  const [bookedDates, setBookedDates] = React.useState<Date[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [paymentMethod, setPaymentMethod] =
    React.useState<(typeof preferredPaymentMethod)[number]["id"]>("stripe");

  const formSchema = buildZodSchema(config.formCards);
  type FormSchemaType = z.infer<typeof formSchema>;

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: buildDefaultValues(config.formCards),
    shouldUnregister: false,
  });

  // Load saved data from localStorage on mount
  React.useEffect(() => {
    const STORAGE_KEY = `booking-form-${config.slug}`;
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Revive date strings to Date objects if they look like dates
        const revived = Object.entries(parsed).reduce(
          (acc, [key, value]) => {
            if (
              typeof value === "string" &&
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)
            ) {
              acc[key] = new Date(value);
            } else {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, unknown>,
        );

        form.reset(revived);

        if (parsed.paymentMethod) {
          setPaymentMethod(parsed.paymentMethod);
        }
      } catch (e) {
        console.error("Failed to load saved form data", e);
      }
    }
  }, [config.slug, form]);

  // Save form data to localStorage on changes
  const watchedValues = form.watch();
  React.useEffect(() => {
    const STORAGE_KEY = `booking-form-${config.slug}`;
    const dataToSave = {
      ...watchedValues,
      paymentMethod,
    };

    // Filter out File objects as they can't be serialized
    const serializableData = Object.entries(dataToSave).reduce(
      (acc, [key, value]) => {
        const isFile = (v: unknown): v is File =>
          v instanceof File ||
          (typeof v === "object" && v !== null && "name" in v && "size" in v);

        if (isFile(value)) return acc;
        if (Array.isArray(value)) {
          acc[key] = value.filter((v) => !isFile(v));
        } else {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, unknown>,
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableData));
  }, [watchedValues, paymentMethod, config.slug]);

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

  async function onSubmit(values: FormSchemaType) {
    setIsSubmitting(true);

    try {
      if (isBooked(values.consultationDate as Date)) {
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
      formData.append("serviceType", config.slug);
      formData.append("paymentMethod", paymentMethod);

      Object.entries(values).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (Array.isArray(value)) {
          value.forEach((v) => {
            if (v instanceof File) {
              formData.append(key, v);
            } else {
              formData.append(key, String(v));
            }
          });
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, String(value));
        }
      });

      const response = await fetch("/api/bookings", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to create booking");
      }

      // Clear saved data on successful submission
      localStorage.removeItem(`booking-form-${config.slug}`);

      if (result.url) {
        window.location.href = result.url;
      } else {
        toast.custom(() => (
          <Notify
            type="success"
            title="Booking successful"
            description="Your consultation has been booked successfully."
          />
        ));
      }
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

  const renderFieldsWithGroups = (
    fields: unknown[],
    form: UseFormReturn,
    isSubmitting: boolean,
  ) => {
    const groups: Record<string, unknown[]> = {};
    const standalone: unknown[] = [];

    fields.forEach((f) => {
      const fieldGroup = (f as { group?: string }).group;

      if (fieldGroup) {
        groups[fieldGroup] ??= [];
        groups[fieldGroup].push(f);
      } else {
        standalone.push(f);
      }
    });

    return (
      <React.Fragment>
        {Object.entries(groups).map(([group, groupFields]) => (
          <div
            key={group}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2"
          >
            {groupFields.map((f) => {
              const data = f as {
                label: string;
                description?:
                  | string
                  | { path: string; value: string; newTab?: boolean };
              } & FieldConfig;

              return (
                <FormField
                  key={data.name}
                  control={form.control}
                  name={data.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {data.label}
                        <span className="text-destructive text-sm! font-medium uppercase">
                          {data.required && "*"}
                        </span>
                      </FormLabel>
                      <RenderFormControl
                        form={form}
                        isSubmitting={isSubmitting}
                        data={data}
                        field={field}
                      />
                      <FormMessage />
                      {data.description &&
                        (typeof data.description === "string" ? (
                          <FormDescription className="mt-2">
                            {data.description}
                          </FormDescription>
                        ) : (
                          data.description && (
                            <Link
                              href={data.description.path as Route}
                              target={
                                data.description.newTab ? "_blank" : "_parent"
                              }
                              className="mt-2"
                            >
                              <FormDescription className="font-medium underline">
                                {data.description.value}
                              </FormDescription>
                            </Link>
                          )
                        ))}
                    </FormItem>
                  )}
                />
              );
            })}
          </div>
        ))}

        {standalone.map((f) => {
          const data = f as {
            label: string;
            description?:
              | string
              | { path: string; value: string; newTab?: boolean };
          } & FieldConfig;

          return (
            <FormField
              key={data.name}
              control={form.control}
              name={data.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {data.label}{" "}
                    <span className="text-destructive text-sm! font-medium uppercase">
                      {data.required && "*"}
                    </span>
                  </FormLabel>
                  <RenderFormControl
                    form={form}
                    isSubmitting={isSubmitting}
                    data={data}
                    field={field}
                  />
                  <FormMessage />

                  {data.description &&
                    (typeof data.description === "string" ? (
                      <FormDescription className="mt-2">
                        {data.description}
                      </FormDescription>
                    ) : (
                      data.description && (
                        <Link
                          href={data.description.path as Route}
                          target={
                            data.description.newTab ? "_blank" : "_parent"
                          }
                          className="mt-2"
                        >
                          <FormDescription className="font-medium underline">
                            {data.description.value}
                          </FormDescription>
                        </Link>
                      )
                    ))}
                </FormItem>
              )}
            />
          );
        })}
      </React.Fragment>
    );
  };

  return (
    <div className="from-secondary/80 via-secondary/30 to-background bg-linear-to-b py-24 lg:py-32">
      <Container size="default">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <div className="columns-1 gap-4 space-y-4 md:columns-2 md:gap-5">
              {Array.isArray(config.formCards) &&
              config.formCards.length > 0 ? (
                config.formCards.map((item) => {
                  if (!Array.isArray(item.fields) || item.fields.length < 1) {
                    return null;
                  }

                  return (
                    <div
                      key={item.id}
                      className="bg-card border-border mb-5 h-auto space-y-5 overflow-hidden rounded-md border p-6 shadow-xs md:p-8 xl:p-12"
                    >
                      <h2 className="mb-1 font-serif text-xl md:text-2xl">
                        {item.title}
                      </h2>
                      <p className="text-muted-foreground mb-8 text-sm font-normal">
                        {item.description}
                      </p>

                      {item.info && (
                        <Alert className="mb-8 w-full border-blue-500/80 bg-blue-500/5 text-blue-500">
                          <AlertTitle className="tracking-wider">
                            <span>{item.info}</span>
                          </AlertTitle>
                        </Alert>
                      )}

                      {renderFieldsWithGroups(
                        [...(item.fields as unknown[])],
                        form,
                        isSubmitting,
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="bg-card border-border mb-5 h-auto space-y-5 overflow-hidden rounded-md border p-6 text-sm shadow-xs md:p-8 xl:p-12">
                  <Alert className="border-destructive/80 bg-destructive/5 text-destructive w-full max-w-lg">
                    <AlertTitle>Form configuration is unavailable.</AlertTitle>
                  </Alert>
                </div>
              )}

              <div className="mb-5 flex flex-col gap-5">
                <div className="bg-card border-border h-auto space-y-5 overflow-hidden rounded-md border p-6 shadow-xs md:p-8 xl:p-12">
                  <h2 className="mb-1 font-serif text-xl md:text-2xl">
                    Payment Method
                  </h2>
                  <p className="text-muted-foreground mb-8 text-sm font-normal">
                    Booking fee of <strong>{formatPrice(config.price)}</strong>{" "}
                    is <strong>Nonrefundable!</strong>
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
                              <span className="text-[11px]">
                                {method.label}
                              </span>
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
      </Container>
    </div>
  );
};

const RenderFormControl = ({
  isSubmitting,
  data,
  field,
  form,
}: {
  isSubmitting: boolean;
  data: FieldConfig;
  field: ControllerRenderProps<FieldValues, string>;
  form: UseFormReturn;
}) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = React.useState<
    number | null
  >(null);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  const handlePrevious = React.useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (data.type !== "radio") return;
      if (selectedOptionIndex === null) return;

      const images = data.items[selectedOptionIndex]?.images ?? [];

      if (!images.length) return;

      setSelectedImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1,
      );
    },
    [data, selectedOptionIndex],
  );

  const handleNext = React.useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (data.type !== "radio") return;
      if (selectedOptionIndex === null) return;

      const images = data.items[selectedOptionIndex]?.images ?? [];

      if (!images.length) return;

      setSelectedImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1,
      );
    },
    [data, selectedOptionIndex],
  );

  switch (data.type) {
    case "text":
    case "email":
    case "textarea":
    case "number": {
      const StartIcon = data.icons ? Icons[data.icons.start.icon] : null;
      const RenderInput =
        data.type === "textarea" ? InputGroupTextarea : InputGroupInput;

      return (
        <FormControl>
          <InputGroup className="h-12">
            <RenderInput
              type={data.type}
              placeholder={data.placeholder}
              min={data.type === "number" ? (data.min ?? 1) : undefined}
              max={data.type === "number" ? data.max : undefined}
              disabled={isSubmitting}
              {...field}
            />
            {StartIcon && (
              <InputGroupAddon>
                <StartIcon />
              </InputGroupAddon>
            )}
            {data.icons && data.icons.end && (
              <InputGroupAddon align="inline-end">
                {data.icons.end.value}
              </InputGroupAddon>
            )}
          </InputGroup>
        </FormControl>
      );
    }
    case "tel":
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="US"
            placeholder={data.placeholder}
            disabled={isSubmitting}
            {...field}
          />
        </FormControl>
      );
    case "date": {
      const value =
        field.value instanceof Date
          ? field.value.toISOString().slice(0, 10)
          : (field.value ?? "");
      return (
        <FormControl>
          <Input
            type="date"
            disabled={isSubmitting}
            value={value}
            onChange={(e) => {
              field.onChange(e.target.value);
            }}
          />
        </FormControl>
      );
    }
    case "datetime-local": {
      const value =
        field.value instanceof Date
          ? formatDateTimeLocal(field.value)
          : field.value
            ? String(field.value)
            : "";
      return (
        <FormControl>
          <Input
            type="datetime-local"
            disabled={isSubmitting}
            min={formatDateTimeLocal(new Date())}
            value={value}
            onChange={(e) => {
              const date = parseDateTimeLocal(e.target.value);
              field.onChange(date);
            }}
          />
        </FormControl>
      );
    }
    case "size": {
      return (
        <FormControl>
          <div className="flex flex-wrap gap-2">
            {data.sizes.map((size) => {
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
      );
    }
    case "select":
      return (
        <FormControl>
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={data.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {data.options.map((opt: (typeof data)["options"][number]) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case "checkbox": {
      const checkboxField = data as CheckboxFieldConfig;
      const selectedValues = form.watch(checkboxField.name) ?? [];

      const containerVariants = {
        hidden: {
          opacity: 0,
        },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: 0.06,
            delayChildren: 0.04,
          },
        },
        exit: {
          opacity: 0,
        },
      };

      const itemVariants = {
        hidden: {
          opacity: 0,
          x: -20,
        },
        animate: {
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.2,
            ease: "easeOut",
          },
        },
        exit: {
          opacity: 0,
          x: -10,
        },
      };

      return (
        <FormControl>
          <ul className="bg-secondary/40 flex w-full flex-col divide-y border shadow-xs">
            {checkboxField.options.map(
              ({ id, label, description, interests }) => {
                const checked = selectedValues.includes(id);
                const showSubInterests = checked && interests?.length;

                return (
                  <React.Fragment key={id}>
                    <FormLabel
                      htmlFor={`dress-${id}`}
                      className={cn(
                        "bg-card flex cursor-pointer items-start justify-between gap-4 p-5",
                        {
                          "pointer-events-none opacity-50": isSubmitting,
                        },
                      )}
                    >
                      <Checkbox
                        id={`dress-${id}`}
                        disabled={isSubmitting}
                        checked={checked}
                        onCheckedChange={(checked) => {
                          const current = field.value || [];

                          if (checked) {
                            field.onChange([...current, id]);
                            return;
                          }

                          // remove parent + all sub-interests
                          const subInterestIds =
                            interests?.map((i) => i.id) ?? [];

                          const next = current.filter(
                            (v: string) =>
                              v !== id && !subInterestIds.includes(v),
                          );

                          field.onChange(next);
                        }}
                      />

                      <div className="flex-1">
                        <p className="mb-1 text-[11px] font-medium">{label}</p>
                        {description && (
                          <p className="text-muted-foreground">{description}</p>
                        )}
                      </div>
                    </FormLabel>

                    <AnimatePresence initial={false}>
                      {showSubInterests && (
                        <motion.div
                          key="sub-interests"
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <motion.ul
                            layout
                            variants={containerVariants as Variants}
                            initial="hidden"
                            animate="animate"
                            exit="exit"
                            className="grid w-full grid-cols-1 divide-y pl-5"
                          >
                            {interests!.map(({ id, label, description }) => (
                              <motion.li
                                key={id}
                                variants={itemVariants as Variants}
                                className="border-l"
                              >
                                <FormLabel
                                  htmlFor={`dress-${id}`}
                                  className={cn(
                                    "bg-card flex cursor-pointer items-start justify-between gap-4 p-5",
                                    {
                                      "pointer-events-none opacity-50":
                                        isSubmitting,
                                    },
                                  )}
                                >
                                  <Checkbox
                                    id={`dress-${id}`}
                                    disabled={isSubmitting || !checked}
                                    checked={field.value?.includes(id)}
                                    onCheckedChange={(checked) => {
                                      const next = checked
                                        ? [...(field.value || []), id]
                                        : field.value?.filter(
                                            (v: string) => v !== id,
                                          );
                                      field.onChange(next);
                                    }}
                                  />

                                  <div className="flex-1">
                                    <p className="mb-1 text-[11px] font-medium">
                                      {label}
                                    </p>
                                    {description && (
                                      <p className="text-muted-foreground">
                                        {description}
                                      </p>
                                    )}
                                  </div>
                                </FormLabel>
                              </motion.li>
                            ))}
                          </motion.ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              },
            )}
          </ul>
        </FormControl>
      );
    }
    case "radio": {
      const hasImages =
        data.items?.some(
          (item) => Array.isArray(item.images) && item.images.length > 0,
        ) ?? false;

      const selectedItem =
        data.type === "radio" && selectedOptionIndex !== null
          ? (data.items[selectedOptionIndex] ?? null)
          : null;

      const images = Array.isArray(selectedItem?.images)
        ? (selectedItem?.images as string[])
        : [];

      return (
        <React.Fragment>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => field.onChange(value)}
              value={field.value}
              className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2"
              disabled={isSubmitting}
            >
              {data.items.map((item, index) => (
                <FormLabel
                  key={item.id}
                  htmlFor={item.id}
                  className={cn(
                    "border-input has-data-[state=checked]:border-primary has-focus-visible:border-ring has-focus-visible:ring-ring relative flex w-full cursor-pointer flex-col gap-0! rounded-md border p-4 shadow-xs transition-[color,box-shadow] outline-none has-focus-visible:ring-2",
                    {
                      "border-destructive": form.formState.errors.budgetType,
                      "pointer-events-none opacity-50": isSubmitting,
                    },
                  )}
                >
                  <div className="flex w-full items-center justify-between gap-4">
                    <RadioGroupItem
                      value={item.title}
                      id={item.id}
                      disabled={isSubmitting}
                    />

                    <p className="text-[11px]!">
                      {`${formatPrice(item.range.from)}${item.range.to ? ` - ${formatPrice(item.range.to)}` : "+"}`}
                    </p>
                  </div>

                  <div className="my-4 flex w-full flex-col gap-1">
                    <p className="text-foreground text-xs!">{item.title}</p>
                    <p className="text-xs! leading-normal font-medium tracking-normal normal-case">
                      {item.description}
                    </p>
                  </div>

                  {item.images && item.images.length > 0 ? (
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOptionIndex(index);
                        setSelectedImageIndex(0);
                      }}
                      className="w-full"
                    >
                      Preview Examples
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      disabled
                      variant="outline"
                      className="w-full"
                    >
                      No available preview
                    </Button>
                  )}
                </FormLabel>
              ))}
            </RadioGroup>
          </FormControl>

          <AnimatePresence>
            {selectedItem && images.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-foreground/95 fixed inset-0 z-100 flex items-center justify-center p-4 backdrop-blur-sm md:p-12"
                onClick={() => setSelectedOptionIndex(null)}
              >
                <Button
                  size="icon-sm"
                  type="button"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOptionIndex(null);
                  }}
                  className="absolute top-6 right-5 z-50 md:top-8 md:right-8"
                >
                  <Icons.Cancel01Icon className="size-4.5" />
                </Button>

                {images.length > 1 && (
                  <Button
                    type="button"
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
                    type="button"
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
                      alt={selectedItem?.title ?? "Preview image"}
                      fill
                      className="object-contain"
                      priority
                      quality={100}
                    />
                  </div>

                  <div className="absolute right-0 -bottom-16 left-0 text-center">
                    <h2 className="font-sans text-lg text-white md:text-xl">
                      {`${formatPrice(selectedItem.range.from)}${selectedItem.range.to ? ` - ${formatPrice(selectedItem.range.to)}` : "+"}`}
                    </h2>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </React.Fragment>
      );
    }
    case "file": {
      const FILE_SIZE_MB = data.size * 1024 * 1024; // size in MB from config
      const fileField = data as FieldConfig;
      const files: File[] = field.value ?? [];

      const min = (fileField as { min?: number }).min ?? 0;
      const max = (fileField as { max?: number }).max ?? Infinity;

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const incoming = Array.from(e.target.files || []);

        const validFiles = incoming.filter((file) => {
          const isImage = file.type.startsWith("image/");
          const isUnderLimit = file.size <= FILE_SIZE_MB;
          return isImage && isUnderLimit;
        });

        const next = [...files, ...validFiles];

        if (next.length > max) {
          toast.custom(() => (
            <Notify
              type="error"
              title="Too many files"
              description={`You can upload a maximum of ${max} files.`}
            />
          ));
          return;
        }

        field.onChange(next); // ✅ RHF stays in sync
      };

      const removePhoto = (index: number) => {
        const next = files.filter((_, i) => i !== index);
        field.onChange(next);
      };

      const truncateMiddle = (value: string, start = 14, end = 10) =>
        value.length <= start + end
          ? value
          : `${value.slice(0, start)}…${value.slice(-end)}`;

      const formatFileSize = (bytes: number) => {
        const kb = bytes / 1024;
        return kb < 1024
          ? `${kb.toFixed(1)} KB`
          : `${(kb / 1024).toFixed(1)} MB`;
      };

      return (
        <React.Fragment>
          <Label
            htmlFor={fileField.name}
            className="border-border hover:border-accent/50 cursor-pointer rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors"
          >
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
              disabled={isSubmitting}
              id={fileField.name}
            />
            <div className="flex flex-1 flex-col items-center gap-1">
              <Icons.ImageUploadIcon className="text-muted-foreground mb-3 size-8" />

              <span className="text-muted-foreground text-sm">
                {data.placeholder}
              </span>
              {min > 0 && (
                <span className="text-muted-foreground text-xs">
                  Upload <strong>{min}</strong> to <strong>{max}</strong> images{" "}
                  <strong>{formatFileSize(FILE_SIZE_MB)}</strong> each
                </span>
              )}
            </div>
          </Label>

          {/* Preview Grid */}
          {files.length > 0 && (
            <div
              className={cn("mt-4 space-y-2", {
                "pointer-events-none opacity-50": isSubmitting,
              })}
            >
              {files.map((file, index) => (
                <div
                  className="flex items-center justify-between rounded-md border p-2"
                  key={index}
                >
                  <div className="flex items-center gap-2">
                    <Icons.File01Icon className="text-muted-foreground size-5" />
                    <span className="flex-1 truncate text-sm">
                      {truncateMiddle(file.name)}
                    </span>
                    <span className="text-muted-foreground mt-0.5 font-mono text-[11px] font-medium uppercase">
                      [{formatFileSize(file.size)}]
                    </span>
                  </div>
                  <Button
                    onClick={() => removePhoto(index)}
                    size="icon-xs"
                    type="button"
                    variant="destructive"
                  >
                    <Icons.Cancel01Icon className="size-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </React.Fragment>
      );
    }
    default:
      break;
  }
};
