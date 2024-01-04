"use client";

import { MENU_ITEMS } from "@/components/nav/nav-menu";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import Link from "next/link";

type Props = Readonly<{
    className: string;
}>;

export function NavMenuDesktop({className}: Props) {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        {MENU_ITEMS.map((item) => (
          <NavigationMenuItem key={item.name}>
            <Link href={item.href} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {item.name}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
