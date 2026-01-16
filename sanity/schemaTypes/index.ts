import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./schemas/category.schema";
import { galleryType } from "./schemas/gallery.schema";
import { productType } from "./schemas/product.schema";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoryType, galleryType, productType],
};
