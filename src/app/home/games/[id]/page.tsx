import {
  getGameById,
  getGameQuestionsById,
} from "@/app/home/games/[id]/actions";
import { PlayGameInput } from "@/app/home/games/[id]/game-input";
import { GameQuestionHistory } from "@/app/home/games/[id]/game-question-history";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isNil } from "@/lib/utils";
import { getSession } from "@/server/session";
import { redirect } from "next/navigation";

export default async function GamePage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect("/");
  }

  const id = parseInt(params.id);
  if (isNaN(id)) {
    redirect("/home/games");
  }

  let game: Awaited<ReturnType<typeof getGameById>> | undefined;
  let questions: Awaited<ReturnType<typeof getGameQuestionsById>> | undefined;

  try {
    const result = await Promise.all([
      getGameById(id),
      getGameQuestionsById(id),
    ]);
    game = result[0];
    questions = result[1];
  } catch (err) {
    // don't need to do anything here, since the values will be undefined the error will be implicitly handled below
  }

  if (!game || !questions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
        </CardHeader>
        <CardContent>Unable to load this game.</CardContent>
      </Card>
    );
  }

  const opponent =
    game.games.player1 === session.id
      ? game.player2.username
      : game.player1.username;
  const title =
    game.games.name === "" ? `Game against ${opponent}` : game.games.name;

  const pastQuestions = questions.filter(
    (q) => q.questionNumber < (game?.games.currentQuestion ?? 0)
  );

  const currentQuestion =
    questions.find((q) => q.questionNumber === game?.games.currentQuestion)
      ?.question ?? "";

  return (
    <article className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {game.gameTypes.name}: {game.gameTypes.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Currently on round {game.games.currentQuestion + 1}/
            {game.games.totalQuestions}
          </p>
          <p>
            <strong>If compete:</strong> current score
          </p>
        </CardContent>
      </Card>
      <PlayGameInput game={game} currentQuestion={currentQuestion} />
      {/* TODO make this > */}
      {game.games.currentQuestion >= 0 && (
        <GameQuestionHistory game={game} pastQuestions={pastQuestions} />
      )}
    </article>
  );
}
