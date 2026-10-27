CREATE TABLE `business_state` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`payload` text NOT NULL,
	`revision` integer NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `state_versions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`state_id` text NOT NULL,
	`revision` integer NOT NULL,
	`payload` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `state_versions_revision` ON `state_versions` (`state_id`,`revision`);