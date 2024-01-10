"use client";

import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function NavLogout() {
    const handler = async () => {
        await logout();
    }
  return <Button variant="secondary" onClick={() => handler()}>Log Out</Button>;
}
