"use client";
import React from "react";
import { z } from "zod";
import Link from "next/link";
import { Route } from "next";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";

import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import {
  ConsultationDataType,
  preferredPaymentMethod,
} from "@/lib/constants/consultation";
import { Button } from "@/ui/button";
import { FieldConfig } from "./types";
import { cn, formatPrice } from "@/lib/utils";
import { Alert, AlertTitle } from "@/ui/alert";
import { Notify } from "@/components/shared/notify";
import { RenderFormControl } from "./render-control";
import { Container } from "@/components/shared/container";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";

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

export const BookingForm: React.FC<{
  config: ConsultationDataType[number];
}> = ({ config }) => {
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
