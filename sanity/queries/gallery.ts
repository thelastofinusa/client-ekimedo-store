import { defineQuery } from "next-sanity";

export const GALLERY_QUERY = defineQuery(`
*[_type == "gallery"
  && (!defined($category) || category->slug.current == $category)
]
| order(_createdAt asc)
[$start...$end]{
  _id,
  "image": image.asset->url,
  featured,
  category->{
    name,
    "slug": slug.current
  }
}
`);

export const FEATURED_GALLERY_QUERY = defineQuery(`
*[_type == "gallery"
 && featured == true
  && (!defined($category) || category->slug.current == $category)
]
| order(_createdAt asc)
[$start...$end]{
  _id,
  "image": image.asset->url,
  category->{
    name,
    "slug": slug.current
  }
}
`);
