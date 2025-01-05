import React, { SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
import axiosInstance from "@/lib/axios-instance";
import {
    teacherServiceBaseUrl,
    uploadFilesServiceBaseUrl,
} from "@/lib/services-base-url";
import {
    AddCourseFormType,
    AddImageResponse,
    CourseNameResponse,
} from "@/types/course-types";
import { AxiosError, AxiosResponse } from "axios";
import { useToast } from "@/hooks/use-toast";

type CreateCourseModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>;
    setCourses: React.Dispatch<
        React.SetStateAction<CourseNameResponse[] | null>
    >;
};

export default function CreateCourseModal(
    { isModalOpen, setIsModalOpen, setCourses }: CreateCourseModalProps,
) {
    const [image, setImage] = useState<File>();
    const [course, setCourse] = useState<AddCourseFormType>({
        course_name: "",
        course_description: "",
        course_image_url: "",
    });
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const uploadImage = async () => {
        const formData = new FormData();
        if (image) {
            formData.append("image", image);
        }
        try {
            const { data }: AxiosResponse<AddImageResponse, AxiosError> =
                await axiosInstance.post(
                    `${uploadFilesServiceBaseUrl}/images/upload-image`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    },
                );
            setCourse({
                ...course,
                course_image_url: data.url,
            });
            toast({
                title: "image downloaded",
                description: "image downloaded successfully",
            });
            setImage(undefined);
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(error.response?.data.error);
            } else {
                setError("An error occurred");
            }
            throw error;
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await uploadImage();
            const { data } = await axiosInstance.post(
                `${teacherServiceBaseUrl}/course/create`,
                course,
            );
            setCourses((prev) => [...(prev || []), {
                course_name: course.course_name,
                id: data.course_id,
            }]);
            toast({
                title: "course created successfully",
            });
            setIsModalOpen(false);
            setCourse({
                course_name: "",
                course_description: "",
                course_image_url: "",
            });
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(error.response?.data.error);
            } else {
                setError("An error occurred");
            }
        }
    };
    return (
        <Dialog open={isModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {error && (
                            <li className="text-red-500 text-center">
                                {error}
                            </li>
                        )}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="courseName" className="text-right">
                                Course Name
                            </Label>
                            <Input
                                id="courseName"
                                value={course.course_name}
                                onChange={(e) =>
                                    setCourse({
                                        ...course,
                                        course_name: e.target.value,
                                    })}
                                className="col-span-3"
                            />
                            <Label
                                htmlFor="courseDescription"
                                className="text-right"
                            >
                                Course Description
                            </Label>
                            <Textarea
                                id="courseDescription"
                                value={course.course_description}
                                onChange={(e) =>
                                    setCourse({
                                        ...course,
                                        course_description: e.target.value,
                                    })}
                                className="col-span-3"
                            />
                            <Label htmlFor="courseImage" className="text-right">
                                course image
                            </Label>
                            <Input
                                id="courseName"
                                type="file"
                                className="col-span-3"
                                onChange={(e) => setImage(e.target.files?.[0])}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create Course</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
