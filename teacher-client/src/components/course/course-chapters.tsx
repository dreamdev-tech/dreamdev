import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChapterType } from "@/types/course-types";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function CourseChapters({ chapters, setIsModalOpen }: {
    chapters: {
        id: string;
        chapter_name: string;
        chapter_type: ChapterType;
        is_verified: boolean;
        chapter_number: number;
    }[];
    setIsModalOpen: (value: boolean) => void;
}) {
    return (
        <>
            {chapters.sort((a, b) => a.chapter_number - b.chapter_number).map((
                chapter,
            ) => (
                <Card
                    key={chapter.id}
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => console.log(chapter)}
                >
                    <CardHeader>
                        <CardTitle>{chapter.chapter_name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-row items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Type: {chapter.chapter_type}
                        </p>
                        <Badge
                            className={cn(
                                "mt-2 ",
                                chapter.is_verified
                                    ? "bg-green-500"
                                    : "bg-red-500",
                            )}
                        >
                            {chapter.is_verified ? "Verified" : "Not Verified"}
                        </Badge>
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
