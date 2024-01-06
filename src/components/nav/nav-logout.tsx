"use client";

import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function NavLogout() {
    const handler = async () => {
        await logout();
        // needed b/c of a bug in nextjs https://github.com/vercel/next.js/issues/58263
        window.location.href = '/';
    }
  return <Button variant="secondary" onClick={() => handler()}>Log Out</Button>;
}
