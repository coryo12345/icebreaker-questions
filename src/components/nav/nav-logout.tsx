"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/session";
import { useRouter } from "next/navigation";

export function NavLogout() {
  const session = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await session.logout();
    router.push('/');
  }

  return <Button variant="secondary" onClick={handleLogout} type="button">Log Out</Button>;
}
