import { defineQuery } from "next-sanity";

export const TESTIMONIAL_QUERY = defineQuery(`
*[_type == "testimonial"] | order(date desc) {
    _id,
    "avatar": avatar.asset->url,
    category -> { name },
    date,
    name,
    rating,
    review,
    "workAssets": workAssets[].asset->url
}
`);
