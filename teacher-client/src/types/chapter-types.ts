import { ChapterType } from "./course-types";

export type AddChapterFormType= {
    course_id: string;
    chapter_type: ChapterType;
    chapter_name: string;
}

export type GetChapterWithChapterSectionsResponseType = {
    chapter_name: string;
    chapter_type: string;
    is_verified: boolean;
    chapter_number: number;
    sections: ChapterSectionResponseType[];
}
export type ChapterSectionResponseType = {
    id: string;
    text: string;
    section_number: number;
}