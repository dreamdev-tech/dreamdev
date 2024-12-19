CREATE TYPE "public"."chapter_type" AS ENUM('learn', 'exercise');--> statement-breakpoint
CREATE TYPE "public"."user_roles" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chapter_section_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chapter_section_id" uuid NOT NULL,
	"file_title" varchar(255),
	"file_type" varchar(255),
	"file_url" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chapter_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chapter_id" uuid NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chapters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"chapter_type" "chapter_type" DEFAULT 'learn' NOT NULL,
	"chapter_name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_name" varchar(255) NOT NULL,
	"course_image_url" varchar(255),
	"course_description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_course_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_course_id" uuid NOT NULL,
	"chapter_id" uuid NOT NULL,
	"is_finished" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	"is_finished" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" "user_roles" DEFAULT 'user',
	"password" varchar(255),
	"is_active" boolean DEFAULT false,
	"is_premium" boolean DEFAULT false,
	"premium_start_date" date,
	"premium_end_date" date,
	"login_provider" varchar(15) NOT NULL,
	"otp_secret" varchar(10),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chapter_section_files" ADD CONSTRAINT "chapter_section_files_chapter_section_id_chapter_sections_id_fk" FOREIGN KEY ("chapter_section_id") REFERENCES "public"."chapter_sections"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chapter_sections" ADD CONSTRAINT "chapter_sections_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chapters" ADD CONSTRAINT "chapters_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_course_progress" ADD CONSTRAINT "user_course_progress_user_course_id_user_courses_id_fk" FOREIGN KEY ("user_course_id") REFERENCES "public"."user_courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_course_progress" ADD CONSTRAINT "user_course_progress_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_courses" ADD CONSTRAINT "user_courses_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chapter_section_files_chapter_section_id_index" ON "chapter_section_files" USING btree ("chapter_section_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chapter_sections_chapter_id_index" ON "chapter_sections" USING btree ("chapter_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chapters_course_id_index" ON "chapters" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_course_progress_user_course_id_index" ON "user_course_progress" USING btree ("user_course_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_course_progress_chapter_id_index" ON "user_course_progress" USING btree ("chapter_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_courses_user_id_index" ON "user_courses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_courses_course_id_index" ON "user_courses" USING btree ("course_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email" ON "users" USING btree ("email");