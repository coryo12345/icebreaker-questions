"use client";

import { TableFooter } from "@/components/table/footer";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "@/lib/session";
import { FullGame } from "@/models/games";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useMemo } from "react";

export function AllGamesTable({ games }: Readonly<{ games: FullGame[] }>) {
  const { session } = useSession();

  const data = useMemo(
    () =>
      games.map((game) => {
        return {
          ...game,
          opponent:
            session.id === -1
              ? ""
              : game.games.player1 === session.id
              ? game.player2.username
              : game.player1.username,
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
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.original.games.id}>
                <TableCell>
                  {row.original.games.name.length === 0 ? (
                    <i className="italic">No game name</i>
                  ) : (
                    row.original.games.name
                  )}
                </TableCell>
                <TableCell>{row.original.opponent}</TableCell>
                <TableCell>{row.original.games.status}</TableCell>
                <TableCell>{row.original.gameTypes.name}</TableCell>
                <TableCell>
                  {row.original.games.lastModified.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button variant="secondary" asChild>
                    <Link href={`/home/games/${row.original.games.id}`}>
                      Play
                    </Link>
                  </Button>
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
