import { getLatestAnswers, getRecentGames } from "@/app/home/actions";
import { AnswersTable } from "@/app/home/answers-table";
import { GamesTable } from "@/app/home/games-table";
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

export default async function HomePage() {
  const games = await getRecentGames();
  const answers = await getLatestAnswers();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>My Answers</CardTitle>
          <CardDescription>
            Your recently added or edited answers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnswersTable answers={answers} />
        </CardContent>
        <CardFooter>
          <Link href="/home/answers">
            <Button className="text-sm" variant="secondary">
              View All Answers
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Games</CardTitle>
          <CardDescription>
            Recent games you have participated in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GamesTable games={games} />
        </CardContent>
        <CardFooter>
          <Link href="/home/games" className="mr-2">
            <Button className="text-sm" variant="secondary">
              All Games
            </Button>
          </Link>
          <Link href="/home/games/new">
            <Button className="text-sm">New Game</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
