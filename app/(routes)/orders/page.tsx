import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Badge } from "@/ui/badge";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/ui/empty";
import { ORDERS_BY_USER_QUERY } from "@/sanity/queries/orders";
import { getOrderStatus } from "@/constants/status";
import { formatPrice, formatDate, formatOrderNumber, cn } from "@/lib/utils";
import { Icons } from "hugeicons-proxy";
import { buttonVariants } from "@/ui/button";
import Image from "next/image";
import { Metadata } from "next";
import { siteConfig } from "@/site.config";
import { HeroComp } from "@/components/shared/hero";
import { Container } from "@/components/shared/container";
import { sanityFetch } from "@/sanity/lib/live";

export const metadata: Metadata = {
  title: "Your Orders",
  description: `View your order history`,
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Your Orders",
    siteName: siteConfig.title,
    description: `View your order history`,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Orders",
    description: `View your order history`,
    images: ["/twitter-image.png"],
  },
};

export default async function OrdersPage() {
  const { userId } = await auth();

  const { data: orders } = await sanityFetch({
    query: ORDERS_BY_USER_QUERY,
    params: { clerkUserId: userId ?? "" },
  });

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Icons.ProductLoadingIcon />
            </EmptyMedia>
            <EmptyTitle>No orders yet</EmptyTitle>
            <EmptyDescription>
              When you place an order, it will appear here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/shop" className={buttonVariants({ size: "lg" })}>
              Start Shopping
            </Link>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-clip">
      <HeroComp
        title="Your Orders"
        description="Keep track of order statuses, examine previous purchases, and monitor delivery progress from the point of checkout to the point of arrival."
      />

      <div className="from-secondary/80 via-secondary/30 to-background bg-linear-to-b py-24 lg:py-32">
        <Container size="xs">
          <div className="space-y-4">
            {orders.map((order) => {
              const status = getOrderStatus(order.status);
              const StatusIcon = Icons[status.icon];
              const images = (order.itemImages ?? []).filter(
                (url): url is string => url !== null,
              );

              return (
                <Link
                  key={order._id}
                  href={`/orders/${order._id}`}
                  className="bg-card group border-border mb-5 block h-auto space-y-5 overflow-hidden rounded-md border p-6 shadow-xs md:p-8"
                >
                  <div className="flex flex-col gap-5 sm:flex-row">
                    {/* Left: Product Images Stack */}
                    <StackedProductImages
                      images={images}
                      totalCount={order.itemCount ?? 0}
                      size="lg"
                    />

                    {/* Right: Order Details */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      {/* Top: Order Info + Status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                            Order #{formatOrderNumber(order.orderNumber)}
                          </p>
                          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                            {formatDate(order.createdAt, "datetime")}
                          </p>
                        </div>
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

                      {/* Bottom: Items + Total */}
                      <div className="mt-2 flex items-end justify-between">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          {order.itemCount}{" "}
                          {order.itemCount === 1 ? "item" : "items"}
                        </p>
                        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer: View Details */}
                  <div className="flex items-center justify-between border-t pt-3">
                    <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                      {order.itemNames?.slice(0, 2).filter(Boolean).join(", ")}
                      {(order.itemNames?.length ?? 0) > 2 && "..."}
                    </p>
                    <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-zinc-500 transition-colors group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-100">
                      View order
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </div>
    </div>
  );
}

interface StackedProductImagesProps {
  images: string[];
  /** Total number of items (used to calculate "+X more" count) */
  totalCount?: number;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether to animate on hover (requires parent with group class) */
  hoverScale?: boolean;
}

const sizeConfig = {
  sm: {
    container: "h-12 w-12",
    single: "100%",
    stacked: "36px",
    offset: 4,
    icon: "h-5 w-5",
    fontSize: "text-[10px]",
    imageSizes: "48px",
  },
  md: {
    container: "h-16 w-16",
    single: "100%",
    stacked: "48px",
    offset: 5,
    icon: "h-6 w-6",
    fontSize: "text-xs",
    imageSizes: "64px",
  },
  lg: {
    container: "h-20 w-20",
    single: "100%",
    stacked: "56px",
    offset: 6,
    icon: "h-8 w-8",
    fontSize: "text-xs",
    imageSizes: "80px",
  },
};

export function StackedProductImages({
  images,
  totalCount,
  size = "sm",
  hoverScale = true,
}: StackedProductImagesProps) {
  const config = sizeConfig[size];
  const displayImages = images.slice(0, 3);
  const extraCount = (totalCount ?? images.length) - displayImages.length;

  const hoverClass = hoverScale
    ? "transition-transform duration-200 group-hover:scale-105"
    : "";

  if (displayImages.length === 0) {
    return (
      <div
        className={`relative flex items-center justify-center ${config.container}`}
      >
        <div
          className={`flex h-full w-full items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-700 ${hoverClass}`}
        >
          <ShoppingBag className={`${config.icon} text-zinc-400`} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center ${config.container}`}
    >
      <div className="relative h-full w-full">
        {displayImages.map((imageUrl, idx) => (
          <div
            key={imageUrl}
            className={`absolute overflow-hidden rounded-lg border-2 border-white bg-zinc-100 shadow-sm dark:border-zinc-800 dark:bg-zinc-700 ${hoverClass}`}
            style={{
              width:
                displayImages.length === 1 ? config.single : config.stacked,
              height:
                displayImages.length === 1 ? config.single : config.stacked,
              top: displayImages.length === 1 ? 0 : `${idx * config.offset}px`,
              left: displayImages.length === 1 ? 0 : `${idx * config.offset}px`,
              zIndex: displayImages.length - idx,
            }}
          >
            <Image
              src={imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes={config.imageSizes}
            />
          </div>
        ))}
        {extraCount > 0 && displayImages.length > 1 && (
          <div
            className={`absolute flex items-center justify-center rounded-lg border-2 border-white bg-zinc-200 font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-600 dark:text-zinc-300 ${config.fontSize}`}
            style={{
              width: config.stacked,
              height: config.stacked,
              top: `${Math.min(displayImages.length, 2) * config.offset}px`,
              left: `${Math.min(displayImages.length, 2) * config.offset}px`,
              zIndex: 0,
            }}
          >
            +{extraCount}
          </div>
        )}
      </div>
    </div>
  );
}
