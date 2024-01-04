import type { Metadata } from "next";

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <>
        <header>
            main nav menu
        </header>
        {children}
    </>
  );
}
