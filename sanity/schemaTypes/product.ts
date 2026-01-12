import { defineField, defineType } from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
        name: 'category',
        title: 'Category',
        type: 'reference',
        to: [{ type: 'category' }],
        validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'priceRange',
      title: 'Price Range',
      type: 'string',
      description: 'e.g. $3,500 - $5,000',
    }),
    defineField({
      name: 'price',
      title: 'Base Price (Numeric)',
      type: 'number',
      description: 'Used for sorting or single price calculation if needed.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'sizes',
      title: 'Sizes',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
            { title: 'US 0', value: 'US 0' },
            { title: 'US 2', value: 'US 2' },
            { title: 'US 4', value: 'US 4' },
            { title: 'US 6', value: 'US 6' },
            { title: 'US 8', value: 'US 8' },
            { title: 'US 10', value: 'US 10' },
            { title: 'US 12', value: 'US 12' },
            { title: 'US 14', value: 'US 14' },
            { title: 'XS', value: 'XS' },
            { title: 'S', value: 'S' },
            { title: 'M', value: 'M' },
            { title: 'L', value: 'L' },
            { title: 'XL', value: 'XL' },
        ]
      }
    }),
    defineField({
      name: 'colors',
      title: 'Colors',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'deliveryTime',
      title: 'Delivery Time',
      type: 'string',
      initialValue: '4 to 6 weeks',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Is Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isArchived',
      title: 'Is Archived',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
