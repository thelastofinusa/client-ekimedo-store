import { defineQuery } from "next-sanity";

export const GALLERY_QUERY = defineQuery(`
    *[_type == "gallery"] | order(_createdAt desc) {
    _id,
    title,
    year,
    category -> {
        _id,
        name,
        "slug": slug.current
    },
    "image": image.asset->url,
    }
`);
