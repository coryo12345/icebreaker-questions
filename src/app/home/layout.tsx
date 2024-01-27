import { NavMenu } from "@/components/nav/nav-menu";
import { redirectIfNotLoggedIn } from "@/server/session";

export default async function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  await redirectIfNotLoggedIn("/");

  return (
    <>
      <NavMenu />
      <main className="mx-auto my-4 px-4 max-w-screen-lg">{children}</main>
    </>
  );
}
