import { ChapterType } from "./course-types";

export type AddChapterFormType= {
    course_id: string;
    chapter_type: ChapterType;
    chapter_name: string;
}