CREATE TABLE `movie_genres` (
	`id` text PRIMARY KEY NOT NULL,
	`movie_id` text NOT NULL,
	`genre_id` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `movie_tags` (
	`id` text PRIMARY KEY NOT NULL,
	`movie_id` text NOT NULL,
	`tag_id` text NOT NULL,
	`created_at` integer NOT NULL
);
