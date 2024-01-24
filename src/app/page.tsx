import { HomeAuthCard } from "@/components/root/home-auth-card";
import { redirectIfLoggedIn } from "@/server/session";

export default async function Home() {
  await redirectIfLoggedIn("/home");
  return (
    <main className="mt-8 flex items-center justify-center h-full w-full">
      <HomeAuthCard />
    </main>
  );
}
