export type AddCourseFormType= {
    course_name: string;
    course_description: string;
    course_image_url: string;
}
export type AddImageResponse= {
    url: string;
}
export type CourseNameResponse= {
    id: string;
    course_name: string;
}
export type GetCourseWithChaptersResponse= {
    course_name: string;
    course_description: string;
    course_image_url: string;
    chapters:{
        id: string;
        chapter_name: string;
        chapter_type: ChapterType;
    }[]
}
export enum ChapterType {
    learn="learn",
    exercise="exercise",
}