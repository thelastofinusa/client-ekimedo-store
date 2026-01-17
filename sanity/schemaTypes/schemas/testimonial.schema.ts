import { defineField, defineType } from "sanity";
import { PiChatsCircleDuotone } from "react-icons/pi";

export const testimonialType = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: PiChatsCircleDuotone,
  fields: [
    defineField({
      name: "name",
      title: "Client Name",
      type: "string",
      validation: (rule) => rule.required().error("Client name is required"),
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      description: "Type of service or project",
      to: [{ type: "category" }],
      validation: (rule) => rule.required().error("Category is required"),
    }),

    defineField({
      name: "review",
      title: "Review",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().error("Review is required"),
    }),

    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      description: "1 to 5",
      validation: (rule) =>
        rule.integer().min(1).max(5).error("Rating must be between 1 and 5"),
    }),

    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      validation: (rule) => rule.required().error("Date is required"),
    }),

    defineField({
      name: "avatar",
      title: "Client Photo",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "workAssets",
      title: "Work Assets",
      type: "array",
      description: "Up to 3 images related to the work",
      of: [
        defineField({
          name: "asset",
          title: "Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "description",
              title: "Description",
              type: "string",
              description: "Short context for this image",
            }),
          ],
        }),
      ],
      validation: (rule) =>
        rule.max(3).error("Maximum of 3 work assets allowed"),
    }),
  ],
});
