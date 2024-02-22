import { users, games, gameTypes } from "@/server/schema";

export type FullGame = {
  games: typeof games.$inferSelect;
  player1: Pick<typeof users.$inferSelect, "id" | "username">;
  player2: Pick<typeof users.$inferSelect, "id" | "username">;
  gameTypes: typeof gameTypes.$inferSelect;
};

export type GameQuestion = {
  gameId: number | null;
  questionId: number;
  questionNumber: number;
  player1Answer: string | null;
  player2Answer: string | null;
  question: string;
};
