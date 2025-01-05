import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router-dom";
import { AddChapterFormType } from "@/types/chapter-types";
import {
    ChapterType,
    GetCourseWithChaptersResponse,
} from "@/types/course-types";
import axiosInstance from "@/lib/axios-instance";
import { teacherServiceBaseUrl } from "@/lib/services-base-url";
import { createChapterSchema } from "@/utils/validations";
import { AxiosError } from "axios";

export function AddChapterModal(
    { isOpen, setIsOpen, setCourse }: {
        isOpen: boolean;
        setIsOpen: (value: boolean) => void;
        setCourse: React.Dispatch<
            React.SetStateAction<GetCourseWithChaptersResponse | null>
        >;
    },
) {
    const { courseId } = useParams();
    const [chapter, setChapter] = useState<AddChapterFormType>({
        course_id: courseId!,
        chapter_type: ChapterType.exercise,
        chapter_name: "",
    });
    
    const [error, setError] = useState<string[] | null>(null);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = createChapterSchema.safeParse(chapter);
        if (!result.success) {
            setError(result.error.errors.flat().map((error) => error.message));
            return;
        }
        try {
            const { data } = await axiosInstance.post(
                `${teacherServiceBaseUrl}/chapter/create`,
                chapter,
            );
            setError(null);
            setCourse((prev) => {
                return prev && {
                    ...prev,
                    chapters: [...prev.chapters, {
                        id: data.chapter_id,
                        chapter_name: chapter.chapter_name,
                        chapter_type: chapter.chapter_type,
                        is_verified: false,
                        chapter_number:data.chapter_number,
                    }],
                };
            });
            setChapter({
                course_id: courseId!,
                chapter_type: ChapterType.exercise,
                chapter_name: "",
            });
            setIsOpen(false);
        } catch (error) {
            if (error instanceof AxiosError) {
                setError([error.response?.data.error]);
                return;
            }
            setError(["Something went wrong"]);
        }
    };

    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Chapter</DialogTitle>
                    {error &&
                        (error.map((error) => (
                            <li key={error} className="text-red-500">{error}</li>
                        )))}
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input
                                id="title"
                                value={chapter.chapter_name}
                                onChange={(e) =>
                                    setChapter({
                                        ...chapter,
                                        chapter_name: e.target.value,
                                    })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <Select
                                onValueChange={(value) =>
                                    setChapter({
                                        ...chapter,
                                        chapter_type: value as ChapterType,
                                    })}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="chapter type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Chapter type</SelectLabel>
                                        <SelectItem
                                            value={ChapterType.exercise}
                                        >
                                            Exercise
                                        </SelectItem>
                                        <SelectItem value={ChapterType.learn}>
                                            Learn
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add Chapter</Button>
                        <Button
                            type="button"
                            variant={"ghost"}
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
