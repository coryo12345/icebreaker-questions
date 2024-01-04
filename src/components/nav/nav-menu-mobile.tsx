"use client";

import { MENU_ITEMS } from "@/components/nav/nav-menu";
import { Button } from "@/components/ui/button";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";

type Props = Readonly<{
  className: string;
}>;

export function NavMenuMobile({ className }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className={cn("p-2", className)} variant="ghost">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <section>
          <ul>
            {MENU_ITEMS.map((item) => (
              <li key={item.name} className="block">
                <Link href={item.href} className={cn(navigationMenuTriggerStyle(), "text-md")}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      </SheetContent>
    </Sheet>
  );
}
