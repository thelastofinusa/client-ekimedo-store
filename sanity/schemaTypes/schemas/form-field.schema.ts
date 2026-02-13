import { defineField, defineType } from "sanity";
import { RiInputMethodLine } from "react-icons/ri";

export const formFieldType = defineType({
  name: "formField",
  title: "Form Field",
  type: "object",
  icon: RiInputMethodLine,
  fields: [
    defineField({
      name: "name",
      title: "Field Name (ID)",
      type: "string",
      description:
        "Unique identifier for this field (camelCase recommended, e.g., 'weddingDate')",
      validation: (rule) =>
        rule
          .required()
          .regex(/^[a-zA-Z0-9_]+$/, "Must be alphanumeric (no spaces)"),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description: "Helper text displayed below the field label",
    }),
    defineField({
      name: "type",
      title: "Field Type",
      type: "string",
      options: {
        list: [
          { title: "Text Input", value: "text" },
          { title: "Email", value: "email" },
          { title: "Phone", value: "tel" },
          { title: "Text Area", value: "textarea" },
          { title: "Select Dropdown", value: "select" },
          { title: "Number", value: "number" },
          { title: "Date", value: "date" },
          { title: "Checkbox", value: "checkbox" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "placeholder",
      title: "Placeholder",
      type: "string",
      hidden: ({ parent }) =>
        parent?.type === "checkbox" || parent?.type === "date",
    }),
    defineField({
      name: "required",
      title: "Required",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "options",
      title: "Options (for Select)",
      type: "array",
      of: [{ type: "string" }],
      hidden: ({ parent }) => parent?.type !== "select",
    }),
    defineField({
      name: "errorMessage",
      title: "Error Message",
      type: "string",
      description: "Custom error message when validation fails",
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "type",
    },
  },
});
