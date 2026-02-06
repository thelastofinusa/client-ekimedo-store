import { NextRequest, NextResponse } from "next/server";
import { createBookingService } from "@/lib/services/booking";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const result = await createBookingService(formData);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
