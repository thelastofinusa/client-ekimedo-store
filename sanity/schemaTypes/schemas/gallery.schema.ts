import { defineField, defineType } from "sanity";
import { LuGalleryVerticalEnd } from "react-icons/lu";

export const galleryType = defineType({
  name: "gallery",
  title: "Gallery",
  type: "document",
  icon: LuGalleryVerticalEnd,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      validation: (rule) => rule.required(),
    }),
  ],
});
