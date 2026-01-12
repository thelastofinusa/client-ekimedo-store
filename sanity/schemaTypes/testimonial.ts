import { defineField, defineType } from 'sanity'

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'e.g. Reception Dress, Bride',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5).required(),
    }),
    defineField({
        name: 'date',
        title: 'Date',
        type: 'string',
        description: 'e.g. May 2024',
    }),
    defineField({
      name: 'image',
      title: 'Client Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
        name: 'workAssets',
        title: 'Work Assets',
        description: 'Images of the work done for the client',
        type: 'array',
        of: [{ type: 'image', options: { hotspot: true } }],
    }),
  ],
})
