"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Icons } from "hugeicons-proxy";

import { Button } from "@/ui/button";
import { Label } from "@/ui/label";
import { ScrollArea } from "@/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/sheet";
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
import { Notify } from "../shared/notify";
import { CATEGORIES_QUERYResult } from "@/sanity.types";

export const TestimonialSheet: React.FC<{
  categories: CATEGORIES_QUERYResult;
}> = ({ categories }) => {
  const { isSignedIn } = useUser();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 4,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
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
        }}
      >
        <Trash className="h-5 w-5" aria-hidden={true} />
      </Button>
    </li>
  ));

  const form = useForm({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      review: "",
      rating: 5,
      categoryId: "",
    },
  });

  async function onSubmit(values: TestimonialFormValues) {
    console.log(values);
    if (!isSignedIn) {
      toast.custom(() => (
        <Notify
          type="error"
          title="Authentication Error"
          description="You must be signed in to submit a testimonial."
        />
      ));
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("review", values.review);
      formData.append("rating", String(values.rating));
      formData.append("categoryId", values.categoryId);

      if (files.length > 0) {
        files.forEach((file) => {
          formData.append("images", file);
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
        setOpen(false);
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

  if (!isSignedIn) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="lg" variant="outline">
          Write a Review
        </Button>
      </SheetTrigger>
      <SheetContent className="gap-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full flex-col"
          >
            <SheetHeader>
              <SheetTitle>Share Your Experience</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-6 overflow-y-auto px-5 py-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a service category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category._id}
                            value={String(category._id)}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="review"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Review</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your experience..."
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`text-2xl focus:outline-none ${
                            star <= Number(field.value)
                              ? "text-orange-500"
                              : "text-secondary"
                          }`}
                          onClick={() => field.onChange(star)}
                        >
                          <Icons.StarIcon className="h-6 w-6 fill-current" />
                        </button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label htmlFor="images">Work Assets (Optional)</Label>
                <div
                  {...getRootProps()}
                  className={cn(
                    isDragActive
                      ? "border-primary bg-primary/10 ring-primary/20 ring-2"
                      : "border-border",
                    isSubmitting ? "pointer-events-none opacity-50" : "",
                    "flex justify-center rounded-md border border-dashed px-6 py-10 transition-colors duration-200",
                  )}
                >
                  <div>
                    <Icons.File01Icon
                      className="text-muted-foreground/80 mx-auto size-6"
                      aria-hidden={true}
                    />
                    <div className="text-muted-foreground mt-2 flex text-xs">
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
                          disabled={isSubmitting}
                        />
                      </label>
                      <p className="pl-1">to upload</p>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs">
                  Allowed files are PNG, JPEG, JPG, WEBP. Max 4 files.
                </p>
                {filesList.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-foreground mt-6 text-sm font-medium">
                      File(s) to upload
                    </p>
                    <ScrollArea className="border-border/50 max-h-[200px] overflow-y-auto border p-4 shadow-xs">
                      <ul role="list" className="flex flex-col gap-4">
                        {filesList}
                      </ul>
                    </ScrollArea>
                  </div>
                )}
              </div>
            </div>

            <SheetFooter className="bg-card mt-auto flex-row">
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </SheetClose>
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                loadingText="Please wait..."
              >
                Submit Review
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
