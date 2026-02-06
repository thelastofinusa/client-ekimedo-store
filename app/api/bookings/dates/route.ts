import { NextResponse } from "next/server";
import { getBookedDatesService } from "@/lib/services/booking";

export async function GET() {
  try {
    const dates = await getBookedDatesService();
    return NextResponse.json(dates);
  } catch (error) {
    console.error("Error fetching booked dates:", error);
    return NextResponse.json(
      { error: "Failed to fetch booked dates" },
      { status: 500 }
    );
  }
}
