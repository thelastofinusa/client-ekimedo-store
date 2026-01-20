import { defineField, defineType } from "sanity";
import { IoColorPaletteOutline } from "react-icons/io5";

export const colorType = defineType({
  name: "color",
  title: "Color",
  type: "document",
  icon: IoColorPaletteOutline,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "value",
      title: "Hex Value",
      type: "string",
      description: "e.g. #FF0000",
      validation: (rule) =>
        rule
          .required()
          .regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be a valid hex color code"),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "value",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle,
        media: IoColorPaletteOutline,
      };
    },
  },
});
