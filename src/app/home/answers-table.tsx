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

export function AnswersTable({ answers }: { answers: any[] | null }) {
  return (
    <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Question</TableHead>
          <TableHead>Answer</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {answers === null && <p>Unable to load recent answers.</p>}
        {answers && answers.length > 0 &&
          answers.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.question}</TableCell>
              <TableCell>{item.answer}</TableCell>
              <TableCell>
                <Button variant="secondary">View</Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
    {answers && answers.length === 0 && <p className="mx-auto w-fit mt-4">No recent answers. Answer some questions by clicking the button below.</p>}
    </>
  );
}
