ALTER TABLE "chapter_sections" RENAME COLUMN "chapter_number" TO "section_number";--> statement-breakpoint
DROP INDEX "chapter_sections_chapter_number_index";--> statement-breakpoint
CREATE INDEX "chapter_sections_section_number_index" ON "chapter_sections" USING btree ("section_number");