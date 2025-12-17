import { buttonVariants } from "@/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-20">
      <Link href="/setup" className={buttonVariants({ variant: "link" })}>
        Setup Page
      </Link>
    </div>
  );
}
