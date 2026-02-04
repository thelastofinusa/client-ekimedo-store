import { defineQuery } from "next-sanity";

export const SERVICE_QUERY = defineQuery(`
*[_type == "service"] | order(_createdAt asc) {
  _id,
  title,
  description,
  price,
  duration,
  "slug": slug.current,
  includes,
  "image": image.asset->url,
  "snapshots": snapshots[]{
    "url": image.asset->url,
    description
  }
}
`);

export const SERVICE_BY_ID_QUERY = defineQuery(`
*[_type == "service" && slug.current == $slug] | order(_createdAt asc) {
  _id,
  title,
  description,
  price,
  duration,
  "slug": slug.current,
  includes,
  "image": image.asset->url,
  "snapshots": snapshots[]{
    "url": image.asset->url,
    description
  }
}
`);
