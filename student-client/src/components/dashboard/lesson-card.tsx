import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LessonCardProps {
    title: string;
    description: string;
    imageUrl: string;
}

export function LessonCard({ title, description, imageUrl }: LessonCardProps) {
    return (
        <Card className="flex flex-col h-full">
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
        </Card>
    );
}
