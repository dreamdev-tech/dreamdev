ALTER TABLE "chapters" ADD COLUMN "chapter_number" integer;--> statement-breakpoint
CREATE INDEX "chapters_chapter_number_index" ON "chapters" USING btree ("chapter_number");