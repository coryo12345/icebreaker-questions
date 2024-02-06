"use client";

import { TableFooter } from "@/components/table/footer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "@/lib/session";
import { games as gamesSchema } from "@/server/schema";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";

export function AllGamesTable({
  games,
}: Readonly<{ games: (typeof gamesSchema.$inferSelect)[] }>) {
  const { session } = useSession();

  const data = useMemo(
    () =>
      games.map((game) => {
        return {
          ...game,
          opponent: game.player1 === session.id ? game.player2 : game.player1,
        };
      }),
    [games, session.id]
  );

  const table = useReactTable({
    data,
    columns: [
      { accessorKey: "question", header: "Question" },
      { accessorKey: "value", header: "Your Answer" },
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Opponent</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Game Type</TableHead>
            <TableHead>Last Move</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.original.id}>
                <TableCell>{row.original.name}</TableCell>
                <TableCell>{row.original.opponent}</TableCell>
                <TableCell>{row.original.status}</TableCell>
                <TableCell>{row.original.gameType}</TableCell>
                <TableCell>
                  {row.original.lastModified.toLocaleString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TableFooter data={data} table={table} />
    </>
  );
}
