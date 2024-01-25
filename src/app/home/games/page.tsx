import { redirectIfNotLoggedIn } from "@/server/session";

export default async function GamesPage() {
  await redirectIfNotLoggedIn("/");
  return <main>game page!</main>;
}
