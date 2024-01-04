import { HomeAuthCard } from "@/components/home/home-auth-card";
import { redirect } from "next/navigation";
import { cookies } from 'next/headers';

// TODO - retrieve password from env variable
const USER_ID_1 = "example"
const USER_ID_2 = "example2"

export default function Home() {

  async function authenticate(value: string): Promise<void> {
    "use server";
    if (USER_ID_1 === value) {
      cookies().set("icebreaker-id", "1");
      redirect("/home");
    } else if (USER_ID_2 === value) {
      cookies().set("icebreaker-id", "2");
      redirect("/home");
    }
  }

  return (
    <main className="mt-8 flex items-center justify-center h-full w-full">
      <HomeAuthCard verify={authenticate} />
    </main>
  )
}
