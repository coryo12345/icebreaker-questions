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

export default function HomePage() {
  return (
    <main>
      <Card>
        <CardHeader>
          <CardTitle>My Answers</CardTitle>
          <CardDescription>
            Your recently added or edited answers
          </CardDescription>
        </CardHeader>
        <CardContent>TODO</CardContent>
        <CardFooter>
          <Link href="/home/answers">
            <Button className="text-md" variant="secondary">
              View All Answers
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Games</CardTitle>
          <CardDescription>
            Recent games you have participated in.
          </CardDescription>
        </CardHeader>
        <CardContent>asd</CardContent>
        <CardFooter>
          <Link href="/home/games/new">
            <Button>New Game</Button>
          </Link>
          <Link href="/home/games">
            <Button>All Games</Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
