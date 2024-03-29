CREATE TABLE `game_questions` (
	`game_id` integer NOT NULL,
	`question_id` integer NOT NULL,
	`question_number` integer NOT NULL,
	`player_1_answer` text,
	`player_2_answer` text,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `game_types` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `games` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`status` integer DEFAULT 0 NOT NULL,
	`player_1` integer,
	`player_2` integer,
	`game_type` integer,
	`name` text DEFAULT '' NOT NULL,
	`total_questions` integer DEFAULT 5 NOT NULL,
	`current_question` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`last_modified` integer NOT NULL,
	FOREIGN KEY (`player_1`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`player_2`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`game_type`) REFERENCES `game_types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_answers` (
	`user_id` integer NOT NULL,
	`question_id` integer NOT NULL,
	`value` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`last_modified` integer NOT NULL,
	PRIMARY KEY(`question_id`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password_hash` text
);
--> statement-breakpoint
CREATE INDEX `game_idx` ON `game_questions` (`game_id`);--> statement-breakpoint
CREATE INDEX `game_number_idx` ON `game_questions` (`game_id`,`question_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `game_types_name_unique` ON `game_types` (`name`);--> statement-breakpoint
CREATE INDEX `p1_idx` ON `games` (`player_1`);--> statement-breakpoint
CREATE INDEX `p2_idx` ON `games` (`player_2`);--> statement-breakpoint
CREATE UNIQUE INDEX `questions_value_unique` ON `questions` (`value`);--> statement-breakpoint
CREATE INDEX `value_idx` ON `questions` (`value`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);