import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { paypalClient } from "@/lib/paypal";
import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import { writeClient } from "@/sanity/lib/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token"); // PayPal order ID
    const bookingId = searchParams.get("booking_id");

    if (!token || !bookingId) {
      return NextResponse.redirect(
        new URL("/consultation?canceled=true", req.url),
      );
    }

    // Capture the payment
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(token);
    // @ts-expect-error - PayPal SDK types might be outdated for empty body
    request.requestBody({});

    const response = await paypalClient.client().execute(request);

    if (response.result.status === "COMPLETED") {
      // Update booking status in Sanity to 'paid' (NOT 'confirmed')
      await writeClient
        .patch(bookingId)
        .set({ 
          status: "paid", 
          paymentStatus: "paid",
          paypalOrderId: token 
        })
        .append("auditLog", [{
          _key: randomUUID(),
          timestamp: new Date().toISOString(),
          action: "PAYMENT_RECEIVED",
          note: `PayPal payment captured (${token}).`
        }])
        .commit();

      return NextResponse.redirect(
        new URL("/consultation?success=true", req.url),
      );
    } else {
      return NextResponse.redirect(
        new URL("/consultation?canceled=true", req.url),
      );
    }
  } catch (error) {
    console.error("PayPal capture error:", error);
    return NextResponse.redirect(
      new URL("/consultation?canceled=true", req.url),
    );
  }
}
