import { users, games, gameTypes } from "@/server/schema";

export type FullGame = {
  games: typeof games.$inferSelect;
  player1: Pick<typeof users.$inferSelect, 'id' | 'username'>;
  player2: Pick<typeof users.$inferSelect, 'id'| 'username'>;
  gameTypes: typeof gameTypes.$inferSelect;
};
