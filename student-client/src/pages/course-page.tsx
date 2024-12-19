import { CourseList } from "@/components/course/course-list";
import { CourseContent } from "@/components/course/course-content";

export default function CoursesPage() {
    return (
        <div className="container mx-auto py-6 px-4">
            <h1 className="text-3xl font-bold mb-6">Development Courses</h1>
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
                <CourseList />
                <CourseContent />
            </div>
        </div>
    );
}
