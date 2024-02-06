import { getGameTypes } from "@/app/home/games/new/actions";
import { NewGameForm } from "@/app/home/games/new/new-game-form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function NewGamePage() {
  const gameTypes = await getGameTypes();

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Game</CardTitle>
        <CardDescription>
          Create a new game to play with someone else
        </CardDescription>
      </CardHeader>
      {gameTypes !== null ? (
        <NewGameForm gameTypes={gameTypes} />
      ) : (
        <p>Something went wrong, please try again later.</p>
      )}
    </Card>
  );
}
