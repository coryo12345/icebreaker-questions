import {
  getGameById,
  getGameQuestionsById,
  getUserSavedAnswer,
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
import { GameQuestion } from "@/models/games";
import { getSession } from "@/server/session";
import { redirect } from "next/navigation";

export default async function GamePage({
  params,
}: Readonly<{ params: { id: string } }>) {
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
    console.error(err);
    // this is redundant, but why not?
    return ErrorScreen();
  }

  if (!game || !questions) {
    return ErrorScreen();
  }

  const opponent =
    game.games.player1 === session.id ? game.player2 : game.player1;
  const title =
    game.games.name === ""
      ? `Game against ${opponent.username}`
      : game.games.name;

  const pastQuestions = questions.filter(
    (q) => q.questionNumber < (game?.games.currentQuestion ?? 0)
  );

  const currentQuestion: GameQuestion | undefined = questions.find(
    (q) => q.questionNumber === game?.games.currentQuestion
  );
  if (!currentQuestion) {
    return ErrorScreen();
  }

  // check if user has already answered
  // if yes, then that means opponent has not answered.
  // (if opponent has answered also then the current question ID would have been incremented!)
  let waitingForOpponent = false;
  {
    const playerKey: keyof typeof currentQuestion = game.games.player1 === session.id ? 'player1Answer' : 'player2Answer';
    waitingForOpponent = !!currentQuestion[playerKey] && currentQuestion[playerKey]!?.length > 0;
  }

  let savedAnswer: Awaited<ReturnType<typeof getUserSavedAnswer>>;
  if (!waitingForOpponent) {
    savedAnswer = await getUserSavedAnswer(
      session.id,
      currentQuestion.questionId
    );
  }

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
            <strong>If compete:</strong> current score (TODO)
          </p>
        </CardContent>
      </Card>
      {waitingForOpponent ? (
        <Card>
          <CardHeader>
            <CardTitle>Waiting for Opponent</CardTitle>
            <CardDescription>You have already answered this question, but your opponent has not.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <PlayGameInput
          game={game}
          currentQuestion={currentQuestion.question}
          savedAnswer={savedAnswer}
        />
      )}
      {game.games.currentQuestion > 0 && (
        <GameQuestionHistory game={game} pastQuestions={pastQuestions} />
      )}
    </article>
  );
}

function ErrorScreen() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Something went wrong</CardTitle>
      </CardHeader>
      <CardContent>Unable to load this game.</CardContent>
    </Card>
  );
}
