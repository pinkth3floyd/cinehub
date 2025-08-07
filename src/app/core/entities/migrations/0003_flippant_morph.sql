CREATE TABLE `movie_links` (
	`id` text PRIMARY KEY NOT NULL,
	`movie_id` text NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`type` text,
	`quality` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `movie_servers` (
	`id` text PRIMARY KEY NOT NULL,
	`movie_id` text NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`quality` text,
	`language` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
