ALTER TABLE "users" DROP COLUMN IF EXISTS "role";--> statement-breakpoint
DROP TYPE "public"."user_roles";--> statement-breakpoint
CREATE TYPE "public"."user_roles" AS ENUM('admin', 'student', 'teacher');