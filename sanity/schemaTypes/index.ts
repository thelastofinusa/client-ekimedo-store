import { type SchemaTypeDefinition } from 'sanity'
import { galleryType } from './gallery'
import { productType } from './product'
import { categoryType } from './category'
import { testimonialType } from './testimonial'
import { customerType } from './customer'
import { orderType } from './order'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [galleryType, productType, categoryType, testimonialType, customerType, orderType],
}
