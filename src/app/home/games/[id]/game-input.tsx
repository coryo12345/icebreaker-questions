"use client";

import { submitAnswer } from "@/app/home/games/[id]/actions";
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
import { useState } from "react";
import { toast } from "sonner";

export function PlayGameInput(
  props: Readonly<{
    game: FullGame;
    currentQuestion: string;
    savedAnswer?: string;
  }>
) {
  const [answer, setAnswer] = useState("");
  const [saveAnswer, setSaveAnswer] = useState(true);

  const useSavedAnswer = () => {
    setAnswer(props.savedAnswer ?? "");
  };

  const submit = async () => {
    const success = await submitAnswer(props.game.games.id, answer, saveAnswer);
    if (success) {
      // TODO
    } else {
      toast.error(
        "Something went wrong, and we couldn't submit your answer. Please try again later."
      );
    }
  };

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
        {props.savedAnswer && props.savedAnswer.length && (
          <section className="my-4">
            <p className="font-semibold">
              You have a saved answer for this question:
            </p>
            <p className="pl-4 my-2">
              &quot;<i className="italic">{props.savedAnswer}</i>{" "}&quot;
            </p>
            <Button variant="secondary" size="sm" onClick={useSavedAnswer}>
              Autofill
            </Button>
          </section>
        )}
        <Label htmlFor="answer">Your Answer</Label>
        <Input
          name="answer"
          placeholder="Enter your answer here"
          className="max-w-[300px]"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

      </CardContent>
      <CardFooter>
        <Button onClick={submit}>Submit</Button>
      </CardFooter>
    </Card>
  );
}
