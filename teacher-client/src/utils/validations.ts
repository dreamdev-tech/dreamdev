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
