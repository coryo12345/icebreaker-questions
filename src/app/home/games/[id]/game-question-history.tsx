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
import { FullGame } from "@/models/games";
import { useState } from "react";

export function GameQuestionHistory(props: Readonly<{ game: FullGame }>) {
  const [game, setGame] = useState(props.game);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previous Rounds</CardTitle>
        <CardDescription>TODO</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Example</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>TODO</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>example</TableCell>
              <TableCell>example</TableCell>
              <TableCell>example</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
