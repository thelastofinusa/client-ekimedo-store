"use client";

import React from "react";
import { toast } from "sonner";
import { Icons } from "hugeicons-proxy";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/ui/button";
import { Label } from "@/ui/label";
import { cn, formatFileSize, truncateFilename } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Textarea } from "@/ui/textarea";
import {
  testimonialSchema,
  TestimonialFormValues,
} from "@/lib/validators/testimonial";
import { Container } from "@/components/shared/container";
import { Notify } from "@/components/shared/notify";
import { consultationsData } from "@/lib/constants/consultation";
import { Input } from "@/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/ui/input-group";
import { FILE_SIZE_MB } from "@/lib/constants/keys";

export const ReviewForm = () => {
  const [isCustomSelected, setIsCustomSelected] =
    React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [files, setFiles] = React.useState<File[]>([]);

  const min = 2;
  const max = 4;

  const form = useForm({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      review: "",
      rating: "",
      service: "",
      customService: "",
    },
  });

  React.useEffect(() => {
    if (form.watch("service") === "custom") {
      setIsCustomSelected(true);
    } else {
      setIsCustomSelected(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("service")]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files || []);

    const oversizedFiles = incoming.filter((file) => file.size > FILE_SIZE_MB);

    if (oversizedFiles.length > 0) {
      toast.custom(() => (
        <Notify
          type="error"
          title="File too large"
          description={`Each image must be smaller than ${formatFileSize(
            FILE_SIZE_MB,
          )}.`}
        />
      ));
    }

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

    setFiles(next);
  };

  const removePhoto = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(data: TestimonialFormValues) {
    const values = {
      ...data,
      service: data.service === "custom" ? data.customService : data.service,
      rating: Number(data.rating),
      workAssets: files,
    };

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      formData.append("review", values.review);
      formData.append("customService", String(values.customService));
      formData.append("service", String(values.service));
      formData.append("rating", String(values.rating));

      if (files.length > 0) {
        files.forEach((file) => {
          formData.append("workAssets", file);
        });
      }

      const response = await fetch("/api/testimonials", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.custom(() => (
          <Notify
            type="success"
            title="Submitted successfully!"
            description="It will be visible after approval."
          />
        ));
        form.reset();
        setFiles([]);
      } else {
        toast.custom(() => (
          <Notify
            type="error"
            title="Error submitting"
            description={result.error || "Something went wrong."}
          />
        ));
      }
    } catch (error) {
      toast.custom(() => (
        <Notify
          type="error"
          title="Something went wrong"
          description={
            error instanceof Error
              ? error.message
              : "An error occurred. Please try again."
          }
        />
      ));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="from-secondary/80 via-secondary/30 to-background flex flex-col gap-10 bg-linear-to-b py-24 lg:py-32">
      <Container size="xs" className="max-w-3xl md:py-8 lg:py-16">
        <div className="bg-card border-border rounded-md border p-6 shadow-xs md:p-8 lg:p-12">
          <h2 className="mb-1 font-serif text-xl md:text-2xl">
            Leave a Review
          </h2>
          <p className="text-muted-foreground mb-8 text-sm font-normal">
            Have thoughts to share? Let us know how we did.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {isCustomSelected && (
                  <FormField
                    control={form.control}
                    name="customService"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom service</FormLabel>
                        <FormControl>
                          <InputGroup>
                            <InputGroupInput
                              {...field}
                              disabled={isSubmitting}
                              placeholder="Type in the service"
                            />
                            <InputGroupAddon align="inline-end">
                              <InputGroupButton
                                size="icon-sm"
                                type="button"
                                onClick={() => form.setValue("service", "")}
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
                )}
                {!isCustomSelected && (
                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of service</FormLabel>
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
                              <SelectValue placeholder="Select service" />
                            </SelectTrigger>
                          </FormControl>
                          {!isSubmitting && (
                            <SelectContent>
                              {[
                                ...consultationsData.map((data) => ({
                                  value: data.title,
                                  label: data.title,
                                })),
                              ].map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                              <SelectItem value="custom">Others</SelectItem>
                            </SelectContent>
                          )}
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overall Rating</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="w-full"
                            disabled={isSubmitting}
                          >
                            <SelectValue placeholder="Select a rating" />
                          </SelectTrigger>
                        </FormControl>

                        {!isSubmitting && (
                          <SelectContent>
                            {[
                              { value: "5", label: "★★★★★ – Excellent" },
                              { value: "4", label: "★★★★☆ – Very Good" },
                              { value: "3", label: "★★★☆☆ – Good" },
                              { value: "2", label: "★★☆☆☆ – Fair" },
                              { value: "1", label: "★☆☆☆☆ – Poor" },
                            ].map((rating) => (
                              <SelectItem
                                key={rating.value}
                                value={rating.value}
                              >
                                {rating.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        )}
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="review"
                render={({ field }) => {
                  const maxLength = 500;
                  const minLength = 10;
                  const currentLength = field.value?.length ?? 0;

                  return (
                    <FormItem>
                      <FormLabel>Write your Testimony</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={isSubmitting}
                          placeholder="Tell us about your experience.."
                        />
                      </FormControl>
                      <div className="flex items-center justify-between">
                        <FormMessage />
                        <span
                          className={cn(
                            "ml-auto text-[10px] font-medium tracking-widest uppercase",
                            currentLength > maxLength
                              ? "text-destructive"
                              : currentLength < minLength
                                ? "text-muted-foreground"
                                : "text-green-700",
                          )}
                        >
                          {currentLength}/{maxLength} characters
                        </span>
                      </div>
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="workAssets"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      Add Photos you&apos;ve taken (Optional)
                    </FormLabel>
                    <FormControl>
                      <Label
                        htmlFor="workAssets"
                        className={cn(
                          "border-border hover:border-accent/50 cursor-pointer border border-dashed px-6 py-8 text-center shadow-xs transition-colors",
                          {
                            "pointer-events-none opacity-50":
                              files.length === max || isSubmitting,
                          },
                        )}
                      >
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={files.length === max || isSubmitting}
                          id="workAssets"
                        />
                        <div className="flex flex-1 flex-col items-center gap-1">
                          <Icons.ImageUploadIcon className="text-muted-foreground mb-3 size-8" />

                          <span className="text-muted-foreground text-sm">
                            Click to upload or drag and drop
                          </span>
                          {min > 0 && (
                            <span className="text-muted-foreground text-xs">
                              Upload <strong>{min}</strong> to{" "}
                              <strong>{max}</strong> images{" "}
                              <strong>{formatFileSize(FILE_SIZE_MB)}</strong>{" "}
                              each
                            </span>
                          )}
                        </div>
                      </Label>
                    </FormControl>
                    {files.length > 0 && (
                      <div
                        className={cn("mt-4 space-y-2", {
                          "pointer-events-none opacity-50": isSubmitting,
                        })}
                      >
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-md border p-2"
                          >
                            <div className="flex items-center gap-2">
                              <Icons.File01Icon className="text-muted-foreground size-5" />
                              <span className="flex-1 truncate text-sm">
                                {truncateFilename(file.name)}
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
                              disabled={isSubmitting}
                            >
                              <Icons.Cancel01Icon className="size-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                size="xl"
                isLoading={isSubmitting}
                loadingText="Please wait..."
                className="w-full"
              >
                Submit Review
              </Button>
            </form>
          </Form>
        </div>
      </Container>
    </div>
  );
};
