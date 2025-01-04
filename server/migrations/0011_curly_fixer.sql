ALTER TABLE "chapters" ADD COLUMN "chapter_number" serial NOT NULL;--> statement-breakpoint
CREATE INDEX "chapters_chapter_number_index" ON "chapters" USING btree ("chapter_number");