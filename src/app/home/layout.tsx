import { NavMenu } from "@/components/nav/nav-menu";

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <>
        <NavMenu />
        {children}
    </>
  );
}
