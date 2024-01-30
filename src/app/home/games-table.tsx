"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function GamesTable({ games }: { games: any[] | null }) {
  return (
    <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Opponent</TableHead>
          <TableHead>Game Type</TableHead>
          <TableHead>Turn Number</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games === null && <p>Unable to load recent games.</p>}
        {games && games.length > 0 &&
          games.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.opponent}</TableCell>
              <TableCell>{item.gameType}</TableCell>
              <TableCell>{item.turnNumber}</TableCell>
              <TableCell>
                <Button variant="secondary">View</Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
    {games && games.length === 0 && <p className="mx-auto w-fit mt-4">No recent games. Start a new game below.</p>}
    </>
  );
}
