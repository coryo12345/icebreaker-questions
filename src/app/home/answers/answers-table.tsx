"use client";

import { saveAnswers, getUserAnswers } from "@/app/home/answers/actions";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/lib/session";
import { questions as questionSchema, userAnswers } from "@/server/schema";
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
}: {
  questions: (typeof questionSchema.$inferSelect)[];
  answers: (typeof userAnswers.$inferSelect)[];
}) {
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
      };
    });
  }, [questions, modifiedAnswers, savedAnswers, session.id]);

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
        { questionId, userId: session.id, value: answer },
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
            {data.map((row) => (
              <TableRow key={row.questionId}>
                <TableCell>{row.question}</TableCell>
                <TableCell>
                  <Input
                    value={row.value}
                    onChange={(e) =>
                      updateAnswer(row.questionId, e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  {row.unsaved && (
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <SaveButton unsaved={unsaved} save={save} />
      </CardFooter>
    </>
  );
}

function SaveButton({ unsaved, save }: { unsaved: boolean; save: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <Button onClick={save} disabled={!unsaved}>
        Save
      </Button>
      {unsaved && <p className="text-sm">You have unsaved answers.</p>}
    </div>
  );
}
