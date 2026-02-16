import { defineField, defineType } from "sanity";
import { RiCalendarCheckLine } from "react-icons/ri";

export const bookingType = defineType({
  name: "booking",
  title: "Bookings",
  type: "document",
  icon: RiCalendarCheckLine,
  fields: [
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "customerEmail",
      title: "Customer Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "customerPhone",
      title: "Customer Phone",
      type: "string",
    }),
    defineField({
      name: "service",
      title: "Service",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bookingDate",
      title: "Booking Date",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endTime",
      title: "End Time",
      type: "datetime",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Confirmed", value: "confirmed" },
          { title: "Cancelled", value: "cancelled" },
          { title: "Completed", value: "completed" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      options: {
        list: [
          { title: "Virtual", value: "virtual" },
          { title: "In-Person", value: "in-person" },
        ],
      },
    }),
    defineField({
      name: "groupSize",
      title: "Group Size",
      type: "number",
    }),
    defineField({
      name: "eventDate",
      title: "Event Date",
      type: "datetime",
    }),
    defineField({
      name: "budgetType",
      title: "Budget Tier",
      type: "string",
    }),
    defineField({
      name: "customBudget",
      title: "Custom Budget",
      type: "string",
    }),
    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
      options: {
        list: [
          { title: "Stripe", value: "stripe" },
          { title: "PayPal", value: "paypal" },
        ],
      },
    }),
    defineField({
      name: "styleInspiration",
      title: "Style Inspiration",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "responses",
      title: "Form Responses",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "key", type: "string", title: "Field Key" },
            { name: "label", type: "string", title: "Field Label" },
            { name: "value", type: "string", title: "Value" },
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "value",
            },
          },
        },
      ],
    }),
    defineField({
      name: "understoodProductionProcess",
      title: "Understood Production Process",
      type: "boolean",
    }),
  ],
  preview: {
    select: {
      title: "customerName",
      subtitle: "bookingDate",
      media: "styleInspiration.0",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle
          ? new Date(subtitle).toLocaleString()
          : "No date set",
        media,
      };
    },
  },
});
