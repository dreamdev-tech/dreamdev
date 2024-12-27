import { Button } from "@/components/ui/button";
import { CourseNameResponse } from "@/types/course-types";



export default function CourseList({ courses }: {courses: CourseNameResponse[]}) {
    return (
        <ul className="space-y-2">
            {courses.map((course) => (
                <li key={course.id}>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-left"
                    >
                        <span className="truncate">{course.course_name}</span>
                    </Button>
                </li>
            ))}
        </ul>
    );
}
