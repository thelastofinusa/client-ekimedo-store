import { defineField, defineType } from "sanity";
import { RiCalendarCheckLine } from "react-icons/ri";

export const bookingType = defineType({
  name: "booking",
  title: "Bookings",
  type: "document",
  icon: RiCalendarCheckLine,
  groups: [
    { name: "general", title: "General Info", default: true },
    { name: "bridal", title: "Bridal" },
    { name: "special-events", title: "Special Events" },
    { name: "prom", title: "Prom" },
    { name: "try-on", title: "Try-On" },
  ],
  fields: [
    defineField({
      name: "fName",
      title: "First Name",
      type: "string",
      group: ["general", "bridal", "special-events", "prom", "try-on"],
    }),
    defineField({
      name: "lName",
      title: "Last Name",
      type: "string",
      group: ["general", "bridal", "special-events", "prom", "try-on"],
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: ["general", "bridal", "special-events", "prom", "try-on"],
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      group: ["general", "bridal", "special-events", "prom", "try-on"],
    }),
    defineField({
      name: "service",
      title: "Service",
      type: "string",
      group: ["general", "bridal", "special-events", "prom", "try-on"],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "consultationDate",
      title: "Consultation Date",
      type: "datetime",
      group: ["general", "bridal", "special-events", "prom", "try-on"],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endTime",
      title: "End Time",
      type: "datetime",
      group: ["general", "bridal", "special-events", "prom", "try-on"],
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "general",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid (Awaiting Confirmation)", value: "paid" },
          { title: "Confirmed", value: "confirmed" },
          { title: "Cancelled", value: "cancelled" },
          { title: "Completed", value: "completed" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
    }),
    defineField({
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      group: "general",
      options: {
        list: [
          { title: "Unpaid", value: "unpaid" },
          { title: "Paid", value: "paid" },
          { title: "Refunded", value: "refunded" },
        ],
      },
      initialValue: "unpaid",
    }),
    defineField({
      name: "auditLog",
      title: "Audit Log",
      type: "array",
      group: "general",
      of: [
        {
          type: "object",
          fields: [
            { name: "timestamp", type: "datetime", title: "Timestamp" },
            { name: "action", type: "string", title: "Action" },
            { name: "note", type: "text", title: "Note" },
          ],
        },
      ],
      readOnly: true,
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: ["general", "bridal", "special-events", "prom", "try-on"],
      options: {
        list: [
          { title: "Virtual", value: "virtual" },
          { title: "In-Person", value: "in-person" },
        ],
      },
    }),
    defineField({
      name: "guests",
      title: "Number of Guests",
      type: "number",
      group: ["general", "bridal", "special-events", "prom", "try-on"],
    }),
    defineField({
      name: "eventDate",
      title: "Event Date",
      type: "datetime",
      group: ["bridal", "special-events", "prom"],
    }),
    defineField({
      name: "budget",
      title: "Budget",
      type: "string",
      group: "bridal",
    }),
    defineField({
      name: "customBudget",
      title: "Custom Budget",
      type: "string",
      group: "bridal",
    }),
    defineField({
      name: "priceRange",
      title: "Budget Range",
      type: "string",
      group: "prom",
    }),
    defineField({
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
      group: "general",
      options: {
        list: [
          { title: "Stripe", value: "stripe" },
          { title: "PayPal", value: "paypal" },
        ],
      },
    }),
    defineField({
      name: "inspiration",
      title: "Style Inspiration",
      type: "array",
      group: ["bridal", "special-events"],
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "interests",
      title: "Interests",
      type: "array",
      group: "bridal",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "referBy",
      title: "Referred By",
      type: "string",
      group: "bridal",
    }),
    defineField({
      name: "timeline",
      title: "Timeline Acknowledged",
      type: "boolean",
      group: ["bridal", "special-events", "prom"],
    }),
    defineField({
      name: "cancellationPolicy",
      title: "Cancellation Policy Accepted",
      type: "boolean",
      group: ["bridal", "special-events", "prom"],
    }),
    defineField({
      name: "rushOrder",
      title: "Rush Order",
      type: "boolean",
      group: ["bridal", "special-events", "prom"],
    }),
    defineField({
      name: "dressSize",
      title: "Dress Size",
      type: "string",
      group: "prom",
    }),
    defineField({
      name: "dressColor",
      title: "Dress Color",
      type: "string",
      group: "prom",
    }),
    defineField({
      name: "specialRequirements",
      title: "Special Requirements",
      type: "text",
      group: "prom",
    }),
    defineField({
      name: "responses",
      title: "Form Responses",
      type: "array",
      group: "general",
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
      name: "confirmationEmailSent",
      title: "Confirmation Email Sent",
      type: "boolean",
      group: "general",
      initialValue: false,
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      fName: "fName",
      lName: "lName",
      subtitle: "consultationDate",
      media: "inspiration.0",
    },
    prepare({ fName, lName, subtitle, media }) {
      return {
        title: `${fName || ""} ${lName || ""}`.trim() || "Unknown Customer",
        subtitle: subtitle
          ? new Date(subtitle).toLocaleString()
          : "No date set",
        media,
      };
    },
  },
});
