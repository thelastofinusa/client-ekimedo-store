import { defineQuery } from "next-sanity";

export const BOOKED_DATES_QUERY = defineQuery(`
  *[_type == "booking" && consultationDate > now() && status != "cancelled"] {
    consultationDate
  }
`);
