import { defineField, defineType } from "sanity";
import { PiChatsCircleDuotone } from "react-icons/pi";

export const testimonialType = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: PiChatsCircleDuotone,
  fields: [
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Approved", value: "approved" },
          { title: "Denied", value: "denied" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
    }),

    defineField({
      name: "name",
      title: "Client Name",
      type: "string",
      validation: (rule) => rule.required().error("Client name is required"),
    }),

    defineField({
      name: "clerkUser",
      title: "Clerk User",
      type: "object",
      readOnly: true,
      fields: [
        defineField({ name: "name", type: "string", title: "Name" }),
        defineField({ name: "email", type: "string", title: "Email" }),
        defineField({ name: "avatarUrl", type: "url", title: "Avatar URL" }),
        defineField({ name: "clerkId", type: "string", title: "Clerk ID" }),
      ],
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
      description: "Up to 4 images related to the work",
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
        rule.max(4).error("Maximum of 4 work assets allowed"),
    }),
  ],
});
