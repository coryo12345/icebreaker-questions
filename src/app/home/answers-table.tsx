"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AnswerPreview } from "@/models/answer";

export function AnswersTable({ answers }: { answers: AnswerPreview[] | null }) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Answer</TableHead>
            <TableHead>Updated At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {answers === null && <p>Unable to load recent answers.</p>}
          {answers &&
            answers.length > 0 &&
            answers.map((item) => (
              <TableRow key={item.questionId}>
                <TableCell>{item.question}</TableCell>
                <TableCell>{item.answer}</TableCell>
                <TableCell>{item.updatedAt.toLocaleString()}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {answers && answers.length === 0 && (
        <p className="mx-auto w-fit mt-4">
          No recent answers. Answer some questions by clicking the button below.
        </p>
      )}
    </>
  );
}
