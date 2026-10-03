CREATE TABLE `clips` (
	`id` text PRIMARY KEY NOT NULL,
	`room` text NOT NULL,
	`slot` integer NOT NULL,
	`title` text NOT NULL,
	`embed` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `editors` (
	`email` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `votes` (
	`user_id` text NOT NULL,
	`room` text NOT NULL,
	`clip_id` text NOT NULL,
	PRIMARY KEY(`user_id`, `room`),
	FOREIGN KEY (`user_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`clip_id`) REFERENCES `clips`(`id`) ON UPDATE no action ON DELETE no action
);
