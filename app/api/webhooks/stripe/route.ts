import Stripe from 'stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { apiVersion, dataset, projectId } from '@/sanity/env'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia' as any, // using explicit version or any to avoid types mismatch if minor version differs
//   typescript: true,
})

const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export async function POST(req: Request) {
  const body = await req.text()
  const headerPayload = await headers()
  const signature = headerPayload.get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const address = session.customer_details?.address

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ]

  const addressString = addressComponents.filter((c) => c !== null).join(', ')

  if (event.type === 'checkout.session.completed') {
    // We assume the order was created in Sanity before checkout (e.g., status pending)
    // and we stored the Sanity Order ID in the metadata of the Stripe session.
    // If not, we might need to find it by some other means or create it here.
    // User request was general "keep track of their orders",
    // Implementation plan said "Update order status in Sanity to paid".
    
    // I am assuming metadata.orderId exists.
    const orderId = session?.metadata?.orderId

    if (orderId) {
        await sanityClient
            .patch(orderId)
            .set({
            isPaid: true,
            address: addressString,
            phone: session?.customer_details?.phone || '',
            status: 'paid' // Updating status enum
            })
            .commit()
    } else {
        // Fallback: If we don't have orderId, we might want to log it or handle it.
        // For this task, assuming the checkout flow passes it is standard.
        // I won't create a new order here because it's complex to reconstruct products from session line items without expansion.
        console.error('No orderId found in Stripe session metadata')
    }
  }

  return new NextResponse(null, { status: 200 })
}
