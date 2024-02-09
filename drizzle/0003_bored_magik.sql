CREATE TABLE `game_questions` (
	`game_id` integer,
	`question_id` integer,
	`question_number` integer NOT NULL,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `game_idx` ON `game_questions` (`game_id`);--> statement-breakpoint
CREATE INDEX `p1_idx` ON `games` (`player_1`);--> statement-breakpoint
CREATE INDEX `p2_idx` ON `games` (`player_2`);