import axiosInstance from "@/lib/axios-instance";
import { teacherServiceBaseUrl } from "@/lib/services-base-url";
import { GetChapterWithChapterSectionsResponseType } from "@/types/chapter-types";
import { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ChapterPage() {
    const { courseId, chapterId } = useParams();
    const [chapter, setChapter] = useState<GetChapterWithChapterSectionsResponseType | null>(null);
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
                <div className="p-4">
                    <h1 className="text-3xl font-semibold">
                        {chapter.chapter_name}
                    </h1>
                    <p className="text-lg">{chapter.is_verified.toString()}</p>
                    <h2 className="text-2xl font-semibold mt-4">
                        Chapter Sections:
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {JSON.stringify(chapter.sections)}
                    </div>
                </div>
            )}
        </div>
    );
}
