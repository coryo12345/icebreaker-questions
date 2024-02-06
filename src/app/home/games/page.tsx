import { getAllGames } from "@/app/home/games/actions";
import { AllGamesTable } from "@/app/home/games/all-games-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function GamesPage() {
  const games = await getAllGames();

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Your Games</CardTitle>
        <CardDescription>All games you are participating in</CardDescription>
      </CardHeader>
      <CardContent>
        {games !== null ? (
          <AllGamesTable games={games} />
        ) : (
          <p>No recent games. Create a new game to start.</p>
        )}
      </CardContent>
      <CardFooter>
        <Link href="/home/games/new">
          <Button className="text-sm">New Game</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
