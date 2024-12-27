ALTER TABLE "courses" ADD COLUMN "teacher_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "courses_teacher_id_index" ON "courses" USING btree ("teacher_id");