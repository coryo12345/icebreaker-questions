import { redirectIfNotLoggedIn } from "@/server/session";

export default async function HomePage() {
  await redirectIfNotLoggedIn("/");
  return <main>home page!</main>;
}
