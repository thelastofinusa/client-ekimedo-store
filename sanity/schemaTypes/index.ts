import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./schemas/category.schema";
import { galleryType } from "./schemas/gallery.schema";
import { productType } from "./schemas/product.schema";
import { customerType } from "./schemas/customer.schema";
import { orderType } from "./schemas/order.schema";
import { testimonialType } from "./schemas/testimonial.schema";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    categoryType,
    galleryType,
    productType,
    customerType,
    orderType,
    testimonialType,
  ],
};
