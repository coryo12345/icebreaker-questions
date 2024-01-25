import { NavLogout } from "@/components/nav/nav-logout";
import { NavMenuDesktop } from "@/components/nav/nav-menu-desktop";
import { NavMenuMobile } from "@/components/nav/nav-menu-mobile";

export const MENU_ITEMS: { name: string; href: string }[] = [
  { name: "Home", href: "/home" },
  { name: "Answers", href: "/home/answers" },
  { name: "Games", href: "/home/games" },
];

export function NavMenu() {
  return (
    <header className="border-b px-4 py-2 flex">
      <NavMenuDesktop className="hidden md:block" />
      <NavMenuMobile className="block md:hidden" />
      <div className="flex-1"></div>
      <NavLogout />
    </header>
  );
}
