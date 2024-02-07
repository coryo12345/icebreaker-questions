import { users, games, gameTypes } from "@/server/schema";

export type FullGame = {
  games: typeof games.$inferSelect;
  player1: typeof users.$inferSelect;
  player2: typeof users.$inferSelect;
  gameTypes: typeof gameTypes.$inferSelect;
};
