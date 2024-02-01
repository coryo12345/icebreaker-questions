import { getAllQuestions, getUserAnswers } from "@/app/home/answers/actions";
import AnswersTable from "@/app/home/answers/answers-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AnswersPage() {
  const questions = await getAllQuestions();
  const userAnswers = await getUserAnswers();

  let content: JSX.Element;

  if (questions === null || userAnswers === null) {
    content = (
      <CardContent>
        <p>Unable to load answer data. Please try again later.</p>
      </CardContent>
    );
  } else {
    content = <AnswersTable questions={questions} answers={userAnswers} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Answers</CardTitle>
        <CardDescription>
          View all available questions and input your answers
        </CardDescription>
      </CardHeader>
      {content}
    </Card>
  );
}
