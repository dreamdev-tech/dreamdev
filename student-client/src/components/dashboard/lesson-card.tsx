import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { LessonCardProps } from "@/types/course-types";

export function LessonCard(
    { title, description, imageUrl, courseId }: LessonCardProps,
) {
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate(`/course/${courseId}`);
    };
    return (
        <Card
            className="flex flex-col h-full"
            onClick={() => console.log("clicked")}
        >
            <div className="relative">
                <img
                    src={imageUrl}
                    alt={title}
                    className="object-cover rounded-t-lg"
                />
            </div>
            <CardHeader>
                <CardTitle className="line-clamp-2">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="line-clamp-3">{description}</p>
            </CardContent>
            <CardFooter>
                <Button
                    onClick={handleNavigate}
                >
                    Start Lesson
                </Button>
            </CardFooter>
        </Card>
    );
}
