"use client";
import z from "zod";
import React from "react";
import { format } from "date-fns";
import { useDropzone } from "react-dropzone";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Button } from "@/ui/button";
import { Icons } from "hugeicons-proxy";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { cn, formatPrice } from "@/lib/utils";
import { Calendar } from "@/ui/calendar";
import { Checkbox } from "@/ui/checkbox";
import { getBookedDates } from "@/lib/actions/calendar";
import { createBooking } from "@/lib/actions/booking";
import { File as FileIcon, Trash } from "lucide-react";
import { ScrollArea } from "@/ui/scroll-area";

interface Service {
  slug: string | null;
  title: string | null;
  price: number | null;
  duration: number | null;
}

interface Props {
  service: Service;
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }

  return !isNaN(date.getTime());
}

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const bookingFormSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  groupSize: z
    .number("Group size is required")
    .min(1, "Must be at least 1")
    .max(10, "Must be at most 10"),
  date: z.date("Date is required"),
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
  agreedToCancellation: z.boolean().refine((val) => val === true, {
    message: "You must agree to the cancellation policy",
  }),
});

type BookingFormSchemaType = z.infer<typeof bookingFormSchema>;

export const BookingForm: React.FC<Props> = ({ service }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [bookedDates, setBookedDates] = React.useState<Date[]>([]);

  const [open, setOpen] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<Date | undefined>();
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [value, setValue] = React.useState(formatDate(date));

  React.useEffect(() => {
    const fetchDates = async () => {
      try {
        const dates = await getBookedDates();
        setBookedDates(dates);
      } catch (error) {
        console.error("Failed to fetch booked dates:", error);
      }
    };
    fetchDates();
  }, []);

  const form = useForm<BookingFormSchemaType>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      groupSize: 1,
      location: "virtual",
      socialMediaHandles: [{ value: "" }],
      agreedToCancellation: false,
      startTime: "",
      styleInspiration: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialMediaHandles",
  });

  async function onSubmit(values: BookingFormSchemaType) {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("serviceType", service.slug || "");
      formData.append("customerName", values.customerName);
      formData.append("customerEmail", values.customerEmail);
      formData.append("customerPhone", values.customerPhone);
      formData.append("groupSize", values.groupSize.toString());
      formData.append("location", values.location);

      const handles = values.socialMediaHandles
        .map((h) => h.value)
        .filter((h) => h !== "");

      if (handles.length > 0) {
        handles.forEach((handle) => {
          formData.append("socialMediaHandle", handle);
        });
      } else {
        formData.append("socialMediaHandle", "");
      }

      formData.append(
        "agreedToCancellation",
        values.agreedToCancellation.toString(),
      );

      // Combine date and time
      const dateStr = format(values.date, "yyyy-MM-dd");
      const dateTime = `${dateStr}T${values.startTime}`;
      formData.append("dateTime", dateTime);

      // Calculate end time
      const [hours, minutes] = values.startTime.split(":").map(Number);
      const startDate = new Date(values.date);
      startDate.setHours(hours, minutes, 0, 0);
      const durationMinutes = service.duration || 60; // Default to 60 minutes if not set
      const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
      formData.append("endTime", endDate.toISOString());

      // Handle files
      if (values.styleInspiration && Array.isArray(values.styleInspiration)) {
        (values.styleInspiration as unknown as File[]).forEach((file) => {
          formData.append("styleInspiration", file);
        });
      }

      const result = await createBooking(formData);

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const [files, setFiles] = React.useState<File[]>([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
      form.setValue("styleInspiration", acceptedFiles as unknown as File[], {
        shouldValidate: true,
      });
    },
  });

  const filesList = files.map((file) => (
    <li
      key={file.name}
      className="relative flex items-center justify-between border p-4 shadow-xs"
    >
      <div className="flex items-center space-x-3 p-0">
        <span className="bg-secondary/50 flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
          <Icons.File02Icon
            className="text-foreground h-5 w-5"
            aria-hidden={true}
          />
        </span>
        <div>
          <p className="text-foreground text-sm font-medium">{file.name}</p>
          <p className="text-muted-foreground mt-0.5 text-xs tracking-wide uppercase">
            {file.size} bytes
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Remove file"
        onClick={() => {
          const newFiles = files.filter((f) => f.name !== file.name);
          setFiles(newFiles);
          form.setValue("styleInspiration", newFiles, { shouldValidate: true });
        }}
      >
        <Trash className="h-5 w-5" aria-hidden={true} />
      </Button>
    </li>
  ));

  return (
    <div className="bg-card rounded-md border p-6 shadow-xs md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl">Book Your Session</h2>
        <p className="text-muted-foreground mt-2">
          Complete the form below to schedule your consultation for{" "}
          <span className="text-foreground font-medium">{service.title}</span>.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 md:gap-6"
        >
          <div className="flex w-full flex-col gap-4 md:flex-row md:gap-6">
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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full flex-col gap-4 md:flex-row md:gap-6">
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
                  <FormLabel>
                    Number of people that are coming with you
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      placeholder="2 People"
                      disabled={isLoading}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full flex-col gap-4 md:flex-row md:gap-6">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="h-max w-full">
                  <FormLabel>Booking Location Preference</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full" disabled={isLoading}>
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
          <div className="flex w-full flex-col gap-4 md:flex-row md:gap-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Preferred Date & Time</FormLabel>
                  <InputGroup className="h-12 w-full">
                    <FormControl>
                      <InputGroupInput
                        placeholder="January 01, 2025"
                        disabled={isLoading}
                        value={value}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          setValue(inputValue);
                          const date = new Date(inputValue);
                          if (isValidDate(date)) {
                            setDate(date);
                            setMonth(date);
                            field.onChange(date);
                          }
                        }}
                        onBlur={field.onBlur}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setOpen(true);
                          }
                        }}
                      />
                    </FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton size="icon-sm" disabled={isLoading}>
                            <Icons.Calendar03Icon />
                            <span className="sr-only">Pick a date</span>
                          </InputGroupButton>
                        </InputGroupAddon>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          month={month}
                          onMonthChange={setMonth}
                          disabled={[
                            ...bookedDates,
                            (date) =>
                              date < new Date() ||
                              date < new Date("1900-01-01"),
                            isLoading,
                          ]}
                          modifiers={{
                            booked: bookedDates,
                          }}
                          onSelect={(date) => {
                            if (date) {
                              setDate(date);
                              setValue(formatDate(date));
                              field.onChange(date);
                              setOpen(false);
                            }
                          }}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </InputGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Start Time</FormLabel>
                  <Input
                    type="time"
                    step="1"
                    disabled={isLoading}
                    className="peer appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="styleInspiration"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Style Inspiration</FormLabel>
                <FormControl>
                  <div
                    {...getRootProps()}
                    className={cn(
                      isDragActive
                        ? "border-primary bg-primary/10 ring-primary/20 ring-2"
                        : "border-border",
                      isLoading ? "pointer-events-none opacity-50" : "",
                      "flex justify-center rounded-md border border-dashed px-6 py-20 transition-colors duration-200",
                    )}
                  >
                    <div>
                      <Icons.File01Icon
                        className="text-muted-foreground/80 mx-auto h-12 w-12"
                        aria-hidden={true}
                      />
                      <div className="text-muted-foreground mt-4 flex text-sm">
                        <p>Drag and drop or</p>
                        <label
                          htmlFor="file"
                          className="text-primary hover:text-primary/80 relative cursor-pointer rounded-sm pl-1 font-medium hover:underline hover:underline-offset-4"
                        >
                          <span>choose file(s)</span>
                          <input
                            {...getInputProps()}
                            type="file"
                            className="sr-only"
                            disabled={isLoading}
                          />
                        </label>
                        <p className="pl-1">to upload</p>
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="sm:flex sm:items-center sm:justify-between">
                  <span>Allowed files are PNG, JPEG, JPG.</span>
                  <span className="pl-1 sm:pl-0">
                    Max 5. size per file: 5MB
                  </span>
                </FormDescription>
                <FormMessage />
                {filesList.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-foreground mt-6 text-sm font-medium">
                      File(s) to upload
                    </p>
                    <ScrollArea className="border-border/50 max-h-[200px] border p-4 shadow-xs">
                      <ul role="list" className="flex flex-col gap-4">
                        {filesList}
                      </ul>
                    </ScrollArea>
                  </div>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="agreedToCancellation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>

                <FormLabel
                  aria-invalid={!!form.formState.errors.agreedToCancellation}
                  className="text-muted-foreground aria-invalid:text-destructive -mt-0.5 font-sans text-sm font-normal tracking-normal normal-case"
                >
                  I understand that cancellations must be made at least 24 hours
                  in advance to receive a full refund. Late cancellations or
                  no-shows may be subject to a fee.
                </FormLabel>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="xl"
            className="w-full"
            isLoading={isLoading}
            loadingText="Processing..."
          >
            Proceed to Payment • ${service.price?.toFixed(2)}
          </Button>
          <p className="text-muted-foreground text-center text-xs">
            Secure payment processed by Stripe
          </p>
        </form>
      </Form>
    </div>
  );
};
