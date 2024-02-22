"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "@/lib/session";
import { FullGame, GameQuestion } from "@/models/games";
import { useMemo, useState } from "react";

export function GameQuestionHistory(
  props: Readonly<{ game: FullGame; pastQuestions: GameQuestion[] }>
) {
  const { session } = useSession();

  const [userKey, opponentKey] = useMemo<
    [keyof GameQuestion, keyof GameQuestion]
  >(() => {
    return session.id === props.game.games.player1
      ? ["player1Answer", "player2Answer"]
      : ["player2Answer", "player1Answer"];
  }, [props.game, session.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previous Rounds</CardTitle>
        <CardDescription>Previously answered questions in this game</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Your Answer</TableHead>
              <TableHead>Opponent&apos;s Answer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.pastQuestions.map((question) => (
              <TableRow key={question.questionId}>
                <TableCell>{question.question}</TableCell>
                <TableCell>{question[userKey]}</TableCell>
                <TableCell>{question[opponentKey]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
