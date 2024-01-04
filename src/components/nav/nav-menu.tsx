import { NavMenuDesktop } from "@/components/nav/nav-menu-desktop";
import { NavMenuMobile } from "@/components/nav/nav-menu-mobile";

export const MENU_ITEMS: { name: string; href: string }[] = [
  { name: "Home", href: "/home" },
  { name: "Answer Questions", href: "/answer" },
  { name: "View Answers", href: "/view" },
];

export function NavMenu() {
  return (
    <header className="border-b px-4 py-2">
      <NavMenuDesktop className="hidden md:block" />
      <NavMenuMobile className="block md:hidden" />
    </header>
  );
}
