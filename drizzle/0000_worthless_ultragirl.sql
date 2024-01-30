CREATE TABLE `game_types` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
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
	`user_id` integer,
	`question_id` integer,
	`value` text DEFAULT '' NOT NULL,
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
CREATE UNIQUE INDEX `game_types_name_unique` ON `game_types` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `questions_value_unique` ON `questions` (`value`);--> statement-breakpoint
CREATE INDEX `value_idx` ON `questions` (`value`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);