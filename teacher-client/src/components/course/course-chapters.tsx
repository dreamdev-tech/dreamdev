import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChapterType } from "@/types/course-types";
import { PlusCircle } from "lucide-react";

export default function CourseChapters({ chapters, setIsModalOpen }: {
    chapters: {
        id: string;
        chapter_name: string;
        chapter_type: ChapterType;
    }[];
    setIsModalOpen: (value: boolean) => void;
}) {
    return (
        <>
            {chapters.map((chapter) => (
                <Card key={chapter.id}>
                    <CardHeader>
                        <CardTitle>{chapter.chapter_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-500">
                            Type: {chapter.chapter_type}
                        </p>
                    </CardContent>
                </Card>
            ))}
            <Card
                className="flex items-center justify-center cursor-pointer hover:bg-accent transition-colors"
                onClick={() => setIsModalOpen(true)}
            >
                <CardContent className="text-center">
                    <PlusCircle className="w-12 h-12 mx-auto mb-2 " />
                    <p className="text-lg font-semibold">
                        Add New Chapter
                    </p>
                </CardContent>
            </Card>
        </>
    );
}
