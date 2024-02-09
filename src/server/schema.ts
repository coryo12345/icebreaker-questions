import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique().notNull(),
  passwordHash: text("password_hash"),
});

// list of questions
export const questions = sqliteTable(
  "questions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    value: text("value").unique().notNull(),
  },
  (table) => ({
    valueIdx: index("value_idx").on(table.value),
  })
);

// game types
export const gameTypes = sqliteTable("game_types", {
  id: integer("id").primaryKey(),
  name: text("name").unique().notNull(),
  description: text("description").notNull().default(""),
});

// games
export const games = sqliteTable(
  "games",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    status: integer("status").notNull().default(0),
    player1: integer("player_1").references((): any => users.id),
    player2: integer("player_2").references((): any => users.id),
    gameType: integer("game_type").references((): any => gameTypes.id),
    name: text("name").notNull().default(""),
    totalQuestions: integer("total_questions").notNull().default(5),
    currentQuestion: integer("current_question").notNull().default(0), // 0-based
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    lastModified: integer("last_modified", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    p1Idx: index("p1_idx").on(table.player1),
    p2Idx: index("p2_idx").on(table.player2),
  })
);

// answers for a user that they can re-use for different games
export const userAnswers = sqliteTable(
  "user_answers",
  {
    userId: integer("user_id")
      .references((): any => users.id)
      .notNull(),
    questionId: integer("question_id")
      .references((): any => questions.id)
      .notNull(),
    value: text("value").notNull().default(""),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    lastModified: integer("last_modified", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.questionId] }),
  })
);

export const gameQuestions = sqliteTable("game_questions", {
  gameId: integer("game_id").references((): any => games.id),
  questionId: integer("question_id").references((): any => questions.id),
  questionNumber: integer("question_number").notNull(),
}, (table) => ({
  gameIdx: index("game_idx").on(table.gameId),
}));
