CREATE TYPE "public"."days_of_week" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');--> statement-breakpoint
ALTER TABLE "teacher_schedule" DROP COLUMN "day";