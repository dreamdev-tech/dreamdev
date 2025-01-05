CREATE INDEX "chapters_is_verified_index" ON "chapters" USING btree ("is_verified");--> statement-breakpoint
CREATE INDEX "courses_is_verified_index" ON "courses" USING btree ("is_verified");