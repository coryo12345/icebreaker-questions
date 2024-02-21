import { getGameById } from "@/app/home/games/[id]/actions";
import { PlayGameInput } from "@/app/home/games/[id]/game-input";
import { GameQuestionHistory } from "@/app/home/games/[id]/game-question-history";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const game = await getGameById(id);
  if (game === null) {
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

  return (
    <article className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{game.gameTypes.description}</CardDescription>
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
      <PlayGameInput game={game} />
      {/* TODO make this > */}
      {game.games.currentQuestion >= 0 && <GameQuestionHistory game={game} />}
    </article>
  );
}
