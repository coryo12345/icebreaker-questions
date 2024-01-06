import { HomeAuthCard } from "@/components/root/home-auth-card";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { CONSTANTS } from "@/constants";

// TODO - retrieve password from env variable
const USER_ID_1 = "example";
const USER_ID_2 = "example2";

export default function Home() {
  async function authenticate(value: string): Promise<boolean> {
    "use server";
    if (USER_ID_1 === value) {
      cookies().set(CONSTANTS.ICEBREAKER_COOKIE_AUTH_ID, "1");
      redirect("/home");
      return true;
    } else if (USER_ID_2 === value) {
      cookies().set(CONSTANTS.ICEBREAKER_COOKIE_AUTH_ID, "2");
      redirect("/home");
      return true;
    }
    return false;
  }

  return (
    <main className="mt-8 flex items-center justify-center h-full w-full">
      <HomeAuthCard verify={authenticate} />
    </main>
  );
}
