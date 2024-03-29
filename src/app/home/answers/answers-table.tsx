"use client";

import { getUserAnswers, saveAnswers } from "@/app/home/answers/actions";
import { TableFooter } from "@/components/table/footer";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/lib/session";
import { questions as questionSchema, userAnswers } from "@/server/schema";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FileWarning } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type UserAnswer = typeof userAnswers.$inferSelect & {
  question: (typeof questionSchema.$inferSelect)["value"];
  unsaved: boolean;
};

export default function AnswersTable({
  questions,
  ...props
}: Readonly<{
  questions: (typeof questionSchema.$inferSelect)[];
  answers: (typeof userAnswers.$inferSelect)[];
}>) {
  const { session } = useSession();
  const [savedAnswers, setSavedAnswers] = useState(props.answers);
  const [modifiedAnswers, setModifiedAnswers] = useState(props.answers);

  const data = useMemo<UserAnswer[]>((): UserAnswer[] => {
    return questions.map((q) => {
      const ans = modifiedAnswers.find((a) => a.questionId === q.id);
      const original = savedAnswers.find((a) => a.questionId === q.id);
      return {
        questionId: q.id,
        question: q.value,
        userId: ans?.userId ?? session.id,
        value: ans?.value ?? "",
        unsaved: original?.value !== ans?.value,
        createdAt: ans?.createdAt ?? new Date(0),
        lastModified: ans?.lastModified ?? new Date(0),
      };
    });
  }, [questions, modifiedAnswers, savedAnswers, session.id]);

  const table = useReactTable({
    data,
    columns: [
      { accessorKey: "question", header: "Question" },
      { accessorKey: "value", header: "Your Answer" },
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const unsaved = useMemo(() => {
    return (
      JSON.stringify(
        savedAnswers.toSorted((a, b) => a.questionId - b.questionId)
      ) !==
      JSON.stringify(
        modifiedAnswers.toSorted((a, b) => a.questionId - b.questionId)
      )
    );
  }, [savedAnswers, modifiedAnswers]);

  const updateAnswer = (questionId: number, answer: string) => {
    const ans = modifiedAnswers.find((ans) => ans.questionId === questionId);
    if (!ans) {
      setModifiedAnswers([
        ...modifiedAnswers,
        {
          questionId,
          userId: session.id,
          value: answer,
          createdAt: new Date(),
          lastModified: new Date(),
        },
      ]);
    } else {
      setModifiedAnswers(
        modifiedAnswers
          .map((ans) => {
            if (ans.questionId === questionId) {
              return {
                questionId,
                userId: session.id,
                value: answer,
                createdAt: ans.createdAt,
                lastModified: new Date(),
              };
            } else {
              return ans;
            }
          })
          .filter((ans) => ans.value !== "")
      );
    }
  };

  const save = async () => {
    const success = await saveAnswers(modifiedAnswers);
    if (success) {
      toast.success("Successfully saved answers.");
    } else {
      toast.error("Unable to save answers, please try again later.");
      return;
    }
    const answers = await getUserAnswers();
    if (answers === null) {
      toast.error("Something went wrong, please try again later.");
      return;
    }
    setSavedAnswers(answers);
    setModifiedAnswers(answers);
  };

  return (
    <>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Your Answer</TableHead>
              <TableHead className="min-w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.original.questionId}>
                  <TableCell className="p-2">{row.original.question}</TableCell>
                  <TableCell className="p-2">
                    <Input
                      value={row.original.value}
                      onChange={(e) =>
                        updateAnswer(row.original.questionId, e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    {row.original.unsaved && (
                      <TooltipProvider>
                        <Tooltip delayDuration={200}>
                          <TooltipContent asChild>
                            <p>
                              This answer has not been saved. Click the save
                              button below.
                            </p>
                          </TooltipContent>
                          <TooltipTrigger asChild>
                            <FileWarning className="w-8 h-6" />
                          </TooltipTrigger>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TableFooter data={data} table={table} />
      </CardContent>
      <CardFooter>
        <SaveButton unsaved={unsaved} save={save} />
      </CardFooter>
    </>
  );
}

function SaveButton({
  unsaved,
  save,
}: Readonly<{ unsaved: boolean; save: () => void }>) {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={save} disabled={!unsaved}>
        Save
      </Button>
      {unsaved && <p className="text-sm">You have unsaved answers.</p>}
    </div>
  );
}
