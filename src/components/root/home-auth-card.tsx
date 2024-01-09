"use client";

import { login, register } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export function HomeAuthCard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const success = await login(username, password);
    if (success === false) {
      toast.error("Failed to log in. Check your username and password.");
    }
  };

  const handleRegister = async () => {
    const success = await register(username, password);
    if (success === false) {
      toast.error("Failed to sign you up. Pick a different username or try again later.");
    }
  }

  return (
    <Card className="min-w-[300px]">
      <CardHeader>
        <CardTitle>Enter Credentials</CardTitle>
        <CardDescription>
          Login / Register to enter the app
        </CardDescription>
      </CardHeader>
      <CardContent>
      <Label htmlFor="username" className="mb-2">
          Username
        </Label>
        <Input
          id="username"
          name="username"
          placeholder="anduin_wrynn42"
          type="text"
          value={username}
          onInput={(e) => {
            setUsername(e.currentTarget.value);
          }}
        />
        <Label htmlFor="password" className="mb-2">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          placeholder="********"
          type="password"
          value={password}
          onInput={(e) => {
            setPassword(e.currentTarget.value);
          }}
        />
      </CardContent>
      <CardFooter>
        <div className="flex gap-2">
        <Button onClick={() => handleLogin()}>Login</Button>
        <Button variant="secondary" onClick={() => handleRegister()}>Register</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
