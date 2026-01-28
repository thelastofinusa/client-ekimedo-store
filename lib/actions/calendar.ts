"use server";

import { client } from "@/sanity/lib/client";
import { BOOKED_DATES_QUERY } from "@/sanity/queries/booking";

export async function getBookedDates() {
  const bookings = await client.fetch(BOOKED_DATES_QUERY);
  return bookings.map((booking: { bookingDate: string }) => new Date(booking.bookingDate));
}
