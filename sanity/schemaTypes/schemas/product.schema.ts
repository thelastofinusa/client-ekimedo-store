import { defineField, defineType } from "sanity";
import { PiDress } from "react-icons/pi";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: PiDress,
  groups: [
    { name: "details", title: "Details" },
    { name: "media", title: "Media" },
    { name: "inventory", title: "Inventory" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "details",
      validation: (rule) => rule.required().error("Product name is required"),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "details",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required().error("Slug is required"),
    }),

    defineField({
      name: "price",
      title: "Price",
      type: "number",
      group: "details",
      description: "Example 599.99",
      validation: (rule) =>
        rule.required().min(0).error("Price must be positive"),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      group: "details",
      validation: (rule) => rule.required().error("Description is required"),
    }),

    defineField({
      name: "images",
      title: "Snapshots",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
      validation: (rule) => rule.min(1).error("At least one image is required"),
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      group: "details",
      validation: (rule) => rule.required().error("Category is required"),
    }),

    defineField({
      name: "sizes",
      title: "Sizes",
      type: "array",
      group: "details",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
        list: [
          { title: "XS", value: "XS" },
          { title: "S", value: "S" },
          { title: "M", value: "M" },
          { title: "L", value: "L" },
          { title: "XL", value: "XL" },
          { title: "XXL", value: "XXL" },
          { title: "Custom", value: "Custom" },
        ],
      },
    }),

    defineField({
      name: "colors",
      title: "Colors",
      type: "array",
      group: "details",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      group: "inventory",
      initialValue: 0,
      validation: (rule) =>
        rule.integer().min(0).error("Stock must be 0 or higher"),
    }),

    defineField({
      name: "details",
      title: "Extra Details",
      type: "array",
      group: "details",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: {
      title: "name",
      category: "category->title",
      media: "images.0",
      price: "price",
    },
    prepare({ title, category, media, price }) {
      return {
        title,
        subtitle: `${category ?? "Uncategorized"} • $${price?.toLocaleString(
          "en-US",
          {
            minimumFractionDigits: 2,
          },
        )}`,
        media,
      };
    },
  },
});
