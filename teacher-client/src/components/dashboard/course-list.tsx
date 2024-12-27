import { Button } from "@/components/ui/button";

type Course = {
    id: number;
    name: string;
};

type CourseListProps = {
    courses: Course[];
};

export default function CourseList({ courses }: CourseListProps) {
    return (
        <ul className="space-y-2">
            {courses.map((course) => (
                <li key={course.id}>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-left"
                    >
                        <span className="truncate">{course.name}</span>
                    </Button>
                </li>
            ))}
        </ul>
    );
}
