CREATE TABLE `refresh_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text NOT NULL
);
