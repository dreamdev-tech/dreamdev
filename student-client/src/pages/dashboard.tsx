import { LessonCard } from "@/components/dashboard/lesson-card";
import { lessons } from "@/helpers/placeholders";


export default function LessonsPage() {
    return (
        <div className="container mx-auto py-12">
            <h1 className="text-3xl font-bold mb-8 text-center">
                Development Lessons
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.map((lesson, index) => (
                    <LessonCard
                        key={index}
                        title={lesson.title}
                        description={lesson.description}
                        imageUrl={lesson.imageUrl}
                    />
                ))}
            </div>
        </div>
    );
}
