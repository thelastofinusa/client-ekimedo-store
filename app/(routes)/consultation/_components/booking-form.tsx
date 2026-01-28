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
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/ui/calendar";
import { Checkbox } from "@/ui/checkbox";
import { getBookedDates } from "@/lib/actions/calendar";
import { createBooking } from "@/lib/actions/booking";

interface Service {
  slug: string | null;
  title: string | null;
  price: number | null;
}

interface Props {
  service: Service;
}

const bookingFormSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  groupSize: z.number("This field is required").min(1, "Must be at least 1"),
  date: z.date(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.enum(["virtual", "in-person"]),
  styleInspiration: z.any(),
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

interface FileUploaderProps {
  value: File[];
  onChange: (files: File[]) => void;
}

const FileUploader = ({ value = [], onChange }: FileUploaderProps) => {
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      onChange([...value, ...acceptedFiles]);
    },
    [value, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  const removeFile = (index: number) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "flex aspect-[2.3] cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-6 shadow-xs transition-colors",
          isDragActive && "border-primary bg-primary/10",
        )}
      >
        <input {...getInputProps()} />
        <Icons.CloudUploadIcon className="text-muted-foreground mb-2 size-10" />
        <p className="text-muted-foreground text-center text-sm">
          {isDragActive
            ? "Drop images here"
            : "Drag & drop images here, or click to select"}
        </p>
      </div>
      {value.length > 0 && (
        <div className="grid grid-cols-5 gap-2 md:gap-4">
          {value.map((file, index) => (
            <div key={index} className="group relative">
              <div className="relative aspect-square overflow-hidden rounded-md border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <Button
                size="icon-xs"
                variant="destructive"
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Icons.Cancel01Icon />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const BookingForm: React.FC<Props> = ({ service }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [bookedDates, setBookedDates] = React.useState<Date[]>([]);

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
      groupSize: undefined,
      location: "virtual",
      socialMediaHandles: [{ value: "" }],
      agreedToCancellation: false,
      startTime: "10:00",
      endTime: "11:00",
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
      formData.append("endTime", `${dateStr}T${values.endTime}`);

      // Handle files
      if (values.styleInspiration && values.styleInspiration.length > 0) {
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
                    <Input placeholder="Jane Doe" {...field} />
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
                    <Input placeholder="jane@example.com" {...field} />
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
                      min="1"
                      type="number"
                      {...field}
                      placeholder="2 People"
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
                  key={index}
                  control={form.control}
                  name={`socialMediaHandles.${index}.value`}
                  render={() => (
                    <FormItem className="mb-1 w-full last-of-type:mb-0">
                      <FormControl>
                        <div className="flex w-full items-center gap-2">
                          <InputGroup className="h-12 w-full">
                            <InputGroupInput
                              type="url"
                              placeholder="https://example.com/yourhandle"
                              {...field}
                            />
                            {fields.length > 1 && (
                              <InputGroupAddon align="inline-end">
                                <InputGroupButton onClick={() => remove(index)}>
                                  <Icons.Cancel01Icon className="h-4 w-4 text-red-500" />
                                </InputGroupButton>
                              </InputGroupAddon>
                            )}
                          </InputGroup>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
          <div className="flex w-full flex-col gap-4 md:flex-row md:gap-6">
            <div className="flex w-full flex-col gap-1">
              <FormLabel>Preferred Date & Time</FormLabel>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            size="lg"
                            className={cn(
                              "bg-card border-input/40 w-full pl-3 text-left font-sans text-base font-normal tracking-normal capitalize active:shadow-xs md:text-sm",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={[
                            ...bookedDates,
                            (date) =>
                              date < new Date() ||
                              date < new Date("1900-01-01"),
                          ]}
                          modifiers={{
                            booked: bookedDates,
                          }}
                          modifiersClassNames={{
                            booked: "[&>button]:line-through opacity-100",
                          }}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex w-full gap-4 md:gap-6">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Start Time</FormLabel>
                    <Input type="time" className="appearance-none" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>End Time</FormLabel>
                    <Input type="time" className="appearance-none" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="styleInspiration"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Style Inspiration</FormLabel>
                <FormControl>
                  <FileUploader value={field.value} onChange={field.onChange} />
                </FormControl>
                <p className="text-muted-foreground text-[0.8rem]">
                  Upload images of styles you like.
                </p>
                <FormMessage />
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
                  />
                </FormControl>

                <FormLabel className="text-muted-foreground -mt-0.5 font-sans text-sm font-normal tracking-normal normal-case">
                  I understand that cancellations must be made at least 24 hours
                  in advance to receive a full refund. Late cancellations or
                  no-shows may be subject to a fee.
                </FormLabel>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            size="xl"
            className="w-full"
          >
            {isLoading ? (
              <>Processing...</>
            ) : (
              <>Proceed to Payment • ${service.price?.toFixed(2)}</>
            )}
          </Button>
          <p className="text-muted-foreground text-center text-xs">
            Secure payment processed by Stripe
          </p>
        </form>
      </Form>
    </div>
  );
};
