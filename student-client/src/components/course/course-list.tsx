import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const courses = [
    { id: 1, title: "Introduction to React" },
    { id: 2, title: "Advanced JavaScript Concepts" },
    { id: 3, title: "CSS Grid and Flexbox" },
    { id: 4, title: "Node.js Fundamentals" },
    { id: 5, title: "Git Version Control" },
    { id: 6, title: "API Design and Development" },
];

export function CourseList() {
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

    return (
        <div className="space-y-4">
            {courses.map((course) => (
                <Card
                    key={course.id}
                    className={cn(
                        "cursor-pointer transition-colors hover:bg-muted",
                        selectedCourse === course.id && "border-primary",
                    )}
                    onClick={() => setSelectedCourse(course.id)}
                >
                    <CardHeader>
                        <CardTitle>{course.title}</CardTitle>
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
}
