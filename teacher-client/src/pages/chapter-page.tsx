import axiosInstance from "@/lib/axios-instance";
import { teacherServiceBaseUrl } from "@/lib/services-base-url";
import { cn } from "@/lib/utils";
import { GetChapterWithChapterSectionsResponseType } from "@/types/chapter-types";
import { AxiosError, AxiosResponse } from "axios";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SectionList from "@/components/chapter/section-list";

export default function ChapterPage() {
    const { courseId, chapterId } = useParams();
    const [chapter, setChapter] = useState<
        GetChapterWithChapterSectionsResponseType | null
    >(null);
    console.log(chapter);

    useEffect(() => {
        async function getChapterWithSections() {
            try {
                const { data }: AxiosResponse<
                    { chapter: GetChapterWithChapterSectionsResponseType },
                    AxiosError
                > = await axiosInstance.get(
                    `${teacherServiceBaseUrl}/chapter/get-chapter/${chapterId}`,
                );
                setChapter(data.chapter);
            } catch (error) {
                console.log(error);
            }
        }
        getChapterWithSections();
    }, [chapterId, courseId]);
    return (
        <div>
            {chapter && (
                <div className="container mx-auto p-4">
                    <div className="flex items-center align-middle space-x-8">
                        <h1 className="text-3xl font-bold mb-6">
                            {chapter.chapter_name}
                        </h1>
                        <Badge
                            className={cn(
                                "",
                                chapter.is_verified
                                    ? "bg-green-500"
                                    : "bg-red-500",
                            )}
                        >
                            {!!chapter.is_verified ? "Verified" : "Not Verified"}
                        </Badge>
                    </div>
                    <SectionList sections={chapter.sections}/>
                </div>
            )}
        </div>
    );
}
