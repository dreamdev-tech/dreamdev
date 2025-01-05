import { ChapterType } from "@/types/course-types";
import { z } from "zod";

export const createCourseSchema = z.object({
    course_name: z
        .string({ message: "course name should be a string" })
        .min(3, { message: "course should be at least 3 characters" })
        .max(50, {
            message: "course name should be at most 50 characters",
        }),
    course_description: z.string({
        message: "course description should be a string",
    }).min(10, { message: "course description be at least 10 characters" }).max(
        500,
        { message: "course description should be at most 500 characters" },
    ),
});

export const createChapterSchema = z.object({
    course_id: z.string({ message: "course id should be a string" }),
    chapter_name: z
        .string({ message: "chapter name should be a string" })
        .min(3, { message: "chapter should be at least 3 characters" })
        .max(50, {
            message: "chapter name should be at most 50 characters",
        }),
    chapter_type: z.enum(Object.values(ChapterType) as [string, ...string[]], {
        message: "chapter type should be either exercise or learn",
    }),
})