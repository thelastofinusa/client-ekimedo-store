import { Container } from "@/components/shared/container";
import { getOrderStatus } from "@/lib/constants/status";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import { sanityFetch } from "@/sanity/lib/live";
import { ORDER_BY_ID_QUERY } from "@/sanity/queries/orders";
import { Badge } from "@/ui/badge";
import { auth } from "@clerk/nextjs/server";
import { Icons } from "hugeicons-proxy";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function OrderDetailsPage({
  params,
}: PageProps<"/orders/[id]">) {
  const { id } = await params;
  const { userId } = await auth();

  const { data: order } = await sanityFetch({
    query: ORDER_BY_ID_QUERY,
    params: { id },
  });

  // Verify order exists and belongs to current user
  if (!order || order.clerkUserId !== userId) return redirect("/shop");

  const status = getOrderStatus(order.status);
  const StatusIcon = Icons[status.icon];

  return (
    <div className="py-24 lg:py-32">
      <Container size="sm">
        <div className="mb-8">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-sm"
          >
            <Icons.ArrowLeft01Icon className="mt-px size-4.5" />
            <span>Back to Orders</span>
          </Link>
          <div className="mt-4 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="font-sans text-xl font-bold sm:text-2xl md:text-3xl">
                {order.orderNumber}
              </h1>
              <Badge
                className={cn(
                  "flex items-center gap-1 border",
                  status.className,
                )}
              >
                <StatusIcon className="size-3.5!" />
                <span className="font-mono font-medium tracking-wider">
                  {status.label}
                </span>
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              Placed on {formatDate(order.createdAt, "datetime")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <section className="bg-card group border-border block h-auto overflow-hidden border shadow-xs">
              <p className="border-b p-6 text-xs font-medium tracking-widest uppercase md:px-8">
                Items ({order.items?.length ?? 0})
              </p>

              <div className="relative flex justify-between divide-y p-6 md:px-8">
                {order.items?.map((item) => (
                  <div key={item._key} className="flex flex-1 gap-4">
                    {/* Image */}
                    <div className="bg-secondary relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
                      {item.product?.image?.asset?.url ? (
                        <Image
                          src={item.product.image.asset.url}
                          alt={item.product.name ?? "Product"}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="space-y-1">
                        <Link
                          href={`/shop/${item.product?.slug}`}
                          className="hover:text-primary font-medium"
                        >
                          {item.product?.name ?? "Unknown Product"}
                        </Link>
                        <p className="text-muted-foreground text-sm">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-1 text-right">
                      <p className="font-medium">
                        {formatPrice(
                          (item.priceAtPurchase ?? 0) * (item.quantity ?? 1),
                        )}
                      </p>
                      {(item.quantity ?? 1) > 1 && (
                        <p className="text-muted-foreground text-sm">
                          {formatPrice(item.priceAtPurchase)} per unit
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-6 lg:col-span-4">
            <div className="bg-foreground text-background border p-6 shadow-xs md:p-8">
              <p className="text-xs font-medium tracking-widest uppercase">
                Order Summary
              </p>

              <div className="mt-6 flex flex-col">
                <div className="flex items-center justify-between text-sm">
                  <p className="text-sm">Subtotal</p>
                  <p className="text-sm font-medium">
                    {formatPrice(order.total)}
                  </p>
                </div>
                <div className="border-border/30 mt-6 flex items-end justify-between border-t pt-6 text-sm">
                  <p className="text-sm">Total</p>
                  <p className="text-lg font-semibold sm:text-xl">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>
            </div>

            {order.address && (
              <div className="bg-card border-border border p-6 shadow-xs md:p-8">
                <div className="flex items-center gap-2">
                  <Icons.LocationUser02Icon className="size-4" />
                  <p className="text-xs font-medium tracking-widest uppercase">
                    Shipping Address
                  </p>
                </div>

                <div className="mt-6 flex flex-col">
                  <div className="space-y-2 text-sm">
                    {order.address.name && (
                      <p className="font-medium">{order.address.name}</p>
                    )}
                    {order.address.line1 && <p>{order.address.line1}</p>}
                    {order.address.line2 && <p>{order.address.line2}</p>}
                    <p>
                      {[order.address.city, order.address.postcode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    {order.address.country && <p>{order.address.country}</p>}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-card border-border border p-6 shadow-xs md:p-8">
              <div className="flex items-center gap-2">
                <Icons.Payment01Icon className="size-4" />
                <p className="text-xs font-medium tracking-widest uppercase">
                  Customer
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-sm">
                  <p className="text-sm">Email</p>
                  <p className="text-sm font-medium">{order.email}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <p className="text-sm">Payment</p>
                  <p className="text-sm font-semibold text-green-700">
                    Confirmed
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
