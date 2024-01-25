import { redirectIfNotLoggedIn } from "@/server/session";

export default async function AnswersPage() {
  await redirectIfNotLoggedIn("/");
  return <main>answers page!</main>;
}
