import { HomeAuthCard } from "@/components/root/home-auth-card";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { CONSTANTS } from "@/constants";
import { Button } from "@/components/ui/button";

// TODO - retrieve password from env variable
const USER_ID_1 = "example";
const USER_ID_2 = "example2";

export default function Home() {
  return (
    <main className="mt-8 flex items-center justify-center h-full w-full">
      <HomeAuthCard />
    </main>
  );
}
