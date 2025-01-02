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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCourse((prev) => {
            return prev && {
                ...prev,
                chapters: [...prev.chapters, {
                    id: Math.random().toString(),
                    chapter_name: chapter.chapter_name,
                    chapter_type: chapter.chapter_type,
                }],
            };
        });
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Chapter</DialogTitle>
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
