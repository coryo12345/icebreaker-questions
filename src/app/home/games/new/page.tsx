import { NewGameForm } from "@/app/home/games/new/new-game-form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewGamePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Game</CardTitle>
        <CardDescription>
          Create a new game to play with someone else
        </CardDescription>
      </CardHeader>
      <NewGameForm />
    </Card>
  );
}
