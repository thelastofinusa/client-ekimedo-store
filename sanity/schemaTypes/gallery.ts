import { defineField, defineType } from 'sanity'

export const galleryType = defineType({
  name: 'gallery',
  title: 'Gallery',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      options: {
        list: [
            { title: '2025', value: '2025' },
            { title: '2024', value: '2024' },
            { title: '2023', value: '2023' },
            { title: '2022', value: '2022' },
            { title: '2021', value: '2021' },
            { title: '2020', value: '2020' },
        ]
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
            { title: 'Bridal', value: 'bridal' },
            { title: 'Prom', value: 'prom' },
            { title: 'Special Events', value: 'special-events' },
        ]
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
  ],
})
