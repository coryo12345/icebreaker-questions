"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

type Props = Readonly<{
    verify: (val: string) => Promise<void>
}>;

export function HomeAuthCard({verify}: Props) {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuth = async () => {
        setLoading(true);
        await verify(password);
        // will either be redirected, or password was incorrect
        setLoading(false);
        toast.error("Invalid Password");
    }

    return (
        <Card>
        <CardHeader>
          <CardTitle>
            Enter Password
          </CardTitle>
          <CardDescription>
            Enter the secret password to enter the app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="password" className="mb-2">Password</Label>
          <Input id="password" name="password" placeholder="********" type="password" value={password} onInput={(e) => {setPassword(e.currentTarget.value)}} />
        </CardContent>
        <CardFooter>
          <Button onClick={handleAuth}>Submit</Button>
        </CardFooter>
      </Card>
    )
}