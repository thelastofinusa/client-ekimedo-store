import Link from "next/link";
import { RiVisaLine } from "react-icons/ri";
import { FaApplePay, FaGooglePay, FaStripe } from "react-icons/fa";

import { Logo } from "./logo";
import { Button } from "@/ui/button";
import { Container } from "./container";
import { siteConfig } from "@/site.config";
import { client } from "@/sanity/lib/client";
import { CATEGORIES_QUERY } from "@/sanity/queries/category";
import { FilteredResponseQueryOptions } from "@sanity/client/stega";
import { Icons } from "hugeicons-proxy";

const options: FilteredResponseQueryOptions = { next: { revalidate: 30 } };

export const Footer = async () => {
  const categories = await client.fetch(CATEGORIES_QUERY, {}, options);

  return (
    <footer className="bg-foreground text-background border-border/10 border-t py-24">
      <Container size="sm">
        {/* Main Footer Grid */}
        <div className="border-border/20 mb-16 grid grid-cols-1 gap-16 border-b pb-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-6 lg:col-span-1">
            <Logo
              href="/"
              srcDesktop="horizontal"
              srcMobile="horizontal"
              mobileSize={[110, 32]}
              color="bone"
              className="block font-serif text-xl tracking-[0.2em] uppercase"
            />
            <p className="text-sm leading-relaxed font-light opacity-70">
              {siteConfig.description}
            </p>

            <div className="flex items-center gap-2">
              <Button variant={"outline"} size="xs" disabled>
                <FaStripe className="size-7" />
              </Button>
              <Button variant={"outline"} size="xs" disabled>
                <FaApplePay className="size-7" />
              </Button>
              <Button variant={"outline"} size="xs" disabled>
                <RiVisaLine className="size-6" />
              </Button>
              <Button variant={"outline"} size="xs" disabled>
                <FaGooglePay className="size-7" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="http://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Icons.InstagramIcon className="text-muted-foreground group-hover:text-background size-6 transition-colors" />
              </a>
              <a
                href="http://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Icons.TiktokIcon className="text-muted-foreground group-hover:text-background size-6 transition-colors" />
              </a>
              <a
                href="http://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Icons.Facebook01Icon className="text-muted-foreground group-hover:text-background size-6 transition-colors" />
              </a>
              <a
                href="http://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Icons.NewTwitterRectangleIcon className="text-muted-foreground group-hover:text-background size-6 transition-colors" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-medium tracking-[0.3em] uppercase opacity-40">
              Collections
            </h4>
            <nav className="flex flex-col gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/products?category=${cat.slug}`}
                  className="text-sm opacity-70 transition-opacity hover:opacity-100"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Explore */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-medium tracking-[0.3em] uppercase opacity-40">
              Explore
            </h4>
            <nav className="flex flex-col gap-4">
              <Link
                href="/gallery"
                className="text-sm opacity-70 transition-opacity hover:opacity-100"
              >
                Our Gallery
              </Link>
              <Link
                href="/about"
                className="text-sm opacity-70 transition-opacity hover:opacity-100"
              >
                About Us
              </Link>
              <Link
                href="/testimonials"
                className="text-sm opacity-70 transition-opacity hover:opacity-100"
              >
                Testimonials
              </Link>
              <Link
                href="/contact"
                className="text-sm opacity-70 transition-opacity hover:opacity-100"
              >
                Let&apos;s Talk
              </Link>
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-medium tracking-[0.3em] uppercase opacity-40">
              Services
            </h4>
            <nav className="flex flex-col gap-4">
              <Link
                href="/consultation"
                className="text-sm opacity-70 transition-opacity hover:opacity-100"
              >
                Book Consultation
              </Link>
              <a
                target="_blank"
                href="mailto:info.e22fashion@gmail.com"
                className="flex items-center gap-2 text-sm opacity-70 transition-opacity hover:opacity-100"
              >
                info.e22fashion@gmail.com
              </a>
              <a
                target="_blank"
                href="https://maps.app.goo.gl/8d2LfPehk2PMqN5Q8"
                className="flex items-center gap-2 text-sm opacity-70 transition-opacity hover:opacity-100"
              >
                Capitol Heights, Maryland
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col items-start justify-between gap-8 text-xs tracking-widest uppercase md:flex-row md:items-center">
          <div className="space-y-2">
            <p className="opacity-60">© 2025 {siteConfig.title}</p>
            <p>All Rights Reserved</p>
          </div>

          <div className="flex gap-4 md:text-right">
            <a href="tel:+12029074865" className="space-y-2">
              <p className="opacity-60">Phone Number</p>
              <p>(+1) 202-907-4865</p>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

// <Container className="flex flex-col gap-32">
//   <div className="flex flex-col items-start justify-between gap-20 md:flex-row">
//     <div className="flex max-w-sm flex-col gap-4">
//       <Logo
//         href="/"
//         srcDesktop="horizontal"
//         srcMobile="horizontal"
//         mobileSize={[110, 32]}
//         color="bone"
//         className="block font-serif text-xl tracking-[0.2em] uppercase"
//       />
//       <p className="text-[11px] leading-relaxed font-light tracking-[0.3em] uppercase opacity-40">
//         {siteConfig.tagline}
//       </p>

//       <div className="mt-4 flex items-center gap-2">
//         <Button variant={"outline"} size="xs" disabled>
//           <FaStripe className="size-7" />
//         </Button>
//         <Button variant={"outline"} size="xs" disabled>
//           <FaApplePay className="size-7" />
//         </Button>
//         <Button variant={"outline"} size="xs" disabled>
//           <RiVisaLine className="size-6" />
//         </Button>
//         <Button variant={"outline"} size="xs" disabled>
//           <FaGooglePay className="size-7" />
//         </Button>
//       </div>
//     </div>

//     <div className="grid w-full grid-cols-2 gap-8 lg:w-max lg:grid-cols-3 lg:gap-10">
//       {footerRoutes.map((item, itemIdx) => (
//         <div
//           key={itemIdx}
//           className="space-y-6 last-of-type:col-span-2 lg:last-of-type:col-span-1"
//         >
//           <span className="block text-[11px] tracking-widest uppercase opacity-20">
//             {item.title}
//           </span>
//           <nav className="flex flex-col gap-3 text-[11px] tracking-widest uppercase">
//             {item.routes.map((route, routeIdx) => (
//               <Link
//                 key={routeIdx}
//                 href={{ pathname: route.path }}
//                 className="opacity-60 transition-opacity hover:opacity-100"
//               >
//                 {route.label}
//               </Link>
//             ))}
//           </nav>
//         </div>
//       ))}
//     </div>
//   </div>

//   <div className="border-border/10 flex items-center justify-between border-t pt-12 text-[9px] tracking-[0.3em] uppercase">
//     <div className="flex items-center gap-3">
//       <Icons.InstagramIcon className="text-muted-foreground size-5" />
//       <Icons.TiktokIcon className="text-muted-foreground size-5" />
//     </div>
//     <p>© 2025 {siteConfig.title}. All rights reserved.</p>
//   </div>
// </Container>
