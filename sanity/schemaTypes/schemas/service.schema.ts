import { defineField, defineType } from "sanity";
import { RiCustomerServiceLine } from "react-icons/ri";

export const serviceType = defineType({
  name: "service",
  title: "Services",
  type: "document",
  icon: RiCustomerServiceLine,
  fields: [
    defineField({
      name: "title",
      title: "Service Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Service Description",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      description: "Example 599.99",
      validation: (rule) =>
        rule.required().min(0).error("Price must be positive"),
    }),
    defineField({
      name: "duration",
      title: "Duration (minutes)",
      type: "number",
      description: "Duration of the service in minutes (e.g., 60 for 1 hour)",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "includes",
      title: "Also includes",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "image",
      title: "Service Banner",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "snapshots",
      title: "Snapshots",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "image",
    },
  },
});
