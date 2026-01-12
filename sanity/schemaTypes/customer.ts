import { defineField, defineType } from 'sanity'

export const customerType = defineType({
  name: 'customer',
  title: 'Customer',
  type: 'document',
  fields: [
    defineField({
      name: 'clerkId',
      title: 'Clerk ID',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'orders',
      title: 'Orders',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'order' } }],
      readOnly: true,
    }),
  ],
})
