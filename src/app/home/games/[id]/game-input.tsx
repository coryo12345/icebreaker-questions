"use client";

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
import { FullGame } from "@/models/games";
import { useMemo, useState } from "react";

export function PlayGameInput(props: Readonly<{ game: FullGame, currentQuestion: string; }>) {
  // const currentQuestion = useMemo(() => {
  //   const round = game.games.currentQuestion;
  // }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Question</CardTitle>
        <CardDescription>
          All players must complete the current turn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-4">{props.currentQuestion}</p>
        <Label htmlFor="answer">Your Answer</Label>
        <Input
          name="answer"
          placeholder="Enter your answer here"
          className="max-w-[300px]"
        />
      </CardContent>
      <CardFooter>
        <Button>Submit</Button>
      </CardFooter>
    </Card>
  );
}
