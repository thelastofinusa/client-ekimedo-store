import { type SchemaTypeDefinition } from "sanity";
import { categoryType } from "./schemas/category.schema";
import { galleryType } from "./schemas/gallery.schema";
import { productType } from "./schemas/product.schema";
import { customerType } from "./schemas/customer.schema";
import { orderType } from "./schemas/order.schema";
import { testimonialType } from "./schemas/testimonial.schema";
import { colorType } from "./schemas/color.schema";
import { bookingType } from "./schemas/booking.schema";
import { businessHoursType } from "./schemas/hours.schema";
import { heroType } from "./schemas/hero.schema";
import { socialType } from "./schemas/social.schema";
import { inquiryType } from "./schemas/inquiry.schema";
import { faqType } from "./schemas/faq.schema";
import { pricingTierType } from "./schemas/pricing.schema";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    categoryType,
    galleryType,
    productType,
    customerType,
    orderType,
    testimonialType,
    colorType,
    bookingType,
    businessHoursType,
    heroType,
    socialType,
    inquiryType,
    faqType,
    pricingTierType,
  ],
};
