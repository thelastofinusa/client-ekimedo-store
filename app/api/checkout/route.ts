import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  typescript: true,
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return new NextResponse("Products are required", { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    items.forEach(
      (item: {
        quantity: number;
        dress: { name: string; image: string; price: number };
        selectedSize: string | number;
        selectedColor?: string;
      }) => {
        let imageUrl = item.dress.image;
        if (imageUrl && !imageUrl.startsWith("http")) {
          imageUrl = `${appUrl}${imageUrl}`;
        }

        line_items.push({
          quantity: item.quantity,
          price_data: {
            currency: "USD",
            product_data: {
              name: item.dress.name,
              images: imageUrl ? [imageUrl] : [],
              metadata: {
                size: item.selectedSize,
                color: item.selectedColor || "N/A",
              },
            },
            unit_amount: Math.round(item.dress.price * 100),
          },
        });
      },
    );

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel`,
      metadata: {
        orderId: "12345", // Example order ID
      },
    });

    return NextResponse.json({ url: session.url }, { headers: corsHeaders });
  } catch (error) {
    console.error("[CHECKOUT_POST]", error);
    // Return the actual error message for debugging purposes (be careful in production)
    const errorMessage =
      error instanceof Error ? error.message : "Internal Error";
    return new NextResponse(errorMessage, { status: 500 });
  }
}
