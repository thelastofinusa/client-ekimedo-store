import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { Button } from "@/ui/button";
import { Icons } from "hugeicons-proxy";
import { ModeSwitcher } from "@/components/shared/switcher";

export default function Setup() {
  return (
    <div className="p-20">
      <Table className="max-w-6xl w-full mx-auto">
        <TableCaption>Button variants and sizes</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="w-[160px]">
              <div className="flex items-center gap-2">
                <ModeSwitcher />
                <p className="font-medium">Type</p>
              </div>
            </TableHead>
            <TableHead>Default</TableHead>
            <TableHead>Secondary</TableHead>
            <TableHead>Outline</TableHead>
            <TableHead>Destructive</TableHead>
            <TableHead>Ghost</TableHead>
            <TableHead>Link</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Text buttons */}
          <TableRow>
            <TableCell className="font-medium">Button</TableCell>
            <TableCell>
              <Button>Shop Now</Button>
            </TableCell>
            <TableCell>
              <Button variant="secondary">Shop Now</Button>
            </TableCell>
            <TableCell>
              <Button variant="outline">Shop Now</Button>
            </TableCell>
            <TableCell>
              <Button variant="destructive">Shop Now</Button>
            </TableCell>
            <TableCell>
              <Button variant="ghost">Shop Now</Button>
            </TableCell>
            <TableCell>
              <Button variant="link">Shop Now</Button>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Button lg</TableCell>
            <TableCell>
              <Button size="lg">Shop Now</Button>
            </TableCell>
            <TableCell>
              <Button size="lg" variant="secondary">
                Shop Now
              </Button>
            </TableCell>
            <TableCell>
              <Button size="lg" variant="outline">
                Shop Now
              </Button>
            </TableCell>
            <TableCell>
              <Button size="lg" variant="destructive">
                Shop Now
              </Button>
            </TableCell>
            <TableCell>
              <Button size="lg" variant="ghost">
                Shop Now
              </Button>
            </TableCell>
            <TableCell>
              <Button size="lg" variant="link">
                Shop Now
              </Button>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Button sm</TableCell>
            <TableCell>
              <Button size="sm">Shop Now</Button>
            </TableCell>
            <TableCell>
              <Button size="sm" variant="secondary">
                Shop Now
              </Button>
            </TableCell>
            <TableCell>
              <Button size="sm" variant="outline">
                Shop Now
              </Button>
            </TableCell>
            <TableCell>
              <Button size="sm" variant="destructive">
                Shop Now
              </Button>
            </TableCell>
            <TableCell>
              <Button size="sm" variant="ghost">
                Shop Now
              </Button>
            </TableCell>
            <TableCell>
              <Button size="sm" variant="link">
                Shop Now
              </Button>
            </TableCell>
          </TableRow>

          {/* Icon buttons */}
          <TableRow>
            <TableCell className="font-medium">Icon</TableCell>
            <TableCell>
              <Button size="icon">
                <Icons.HugeiconsIcon />
              </Button>
            </TableCell>
            <TableCell>
              <Button size="icon" variant="secondary">
                <Icons.HugeiconsIcon />
              </Button>
            </TableCell>
            <TableCell>
              <Button size="icon" variant="outline">
                <Icons.HugeiconsIcon />
              </Button>
            </TableCell>
            <TableCell>
              <Button size="icon" variant="destructive">
                <Icons.HugeiconsIcon />
              </Button>
            </TableCell>
            <TableCell>
              <Button size="icon" variant="ghost">
                <Icons.HugeiconsIcon />
              </Button>
            </TableCell>
            <TableCell>
              <Button size="icon" variant="link">
                <Icons.HugeiconsIcon />
              </Button>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Icon lg</TableCell>
            <TableCell>
              <Button size="icon-lg">
                <Icons.HugeiconsIcon />
              </Button>
            </TableCell>
            <TableCell>
              <Button size="icon-lg" variant="secondary">
                <Icons.HugeiconsIcon />
              </Button>
            </TableCell>
            <TableCell>
              <Button size="icon-lg" variant="outline">
                <Icons.HugeiconsIcon />
              </Button>
            </TableCell>
            <TableCell>
              <Button size="icon-lg" variant="destructive">
                <Icons.HugeiconsIcon />
              </Button>
            </TableCell>
            <TableCell>
              <Button size="icon-lg" variant="ghost">
                <Icons.HugeiconsIcon />
              </Button>
            </TableCell>
            <TableCell>
              <Button size="icon-lg" variant="link">
                <Icons.HugeiconsIcon />
              </Button>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Icon sm</TableCell>
            <TableCell>
              <Button size="icon-sm">
                <Icons.HugeiconsIcon />
              </Button>
            </TableCell>
            <TableCell>
              <Button size="icon-sm" variant="secondary">
                <Icons.HugeiconsIcon />
              </Button>
            </TableCell>
            <TableCell>
              <Button size="icon-sm" variant="outline">
                <Icons.HugeiconsIcon />
              </Button>
            </TableCell>
            <TableCell>
              <Button size="icon-sm" variant="destructive">
                <Icons.HugeiconsIcon />
              </Button>
            </TableCell>
            <TableCell>
              <Button size="icon-sm" variant="ghost">
                <Icons.HugeiconsIcon />
              </Button>
            </TableCell>
            <TableCell>
              <Button size="icon-sm" variant="link">
                <Icons.HugeiconsIcon />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
