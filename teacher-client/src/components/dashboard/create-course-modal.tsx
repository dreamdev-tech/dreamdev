import { useState } from "react";
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
import { uploadFilesServiceBaseUrl } from "@/lib/services-base-url";

type CreateCourseModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreateCourse: (courseName: string) => void;
};

export default function CreateCourseModal(
    { isOpen, onClose, onCreateCourse }: CreateCourseModalProps,
) {
    const [courseName, setCourseName] = useState("");
    const [image, setImage] = useState<File>();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // if (courseName.trim()) {
        //     onCreateCourse(courseName.trim());
        //     setCourseName("");
        // }
        await uploadImage();
    };
    const uploadImage = async () => {
        const formData = new FormData();
        if (image) {
            formData.append("image", image);
        }
        try {
            const { data } = await axiosInstance.post(`${uploadFilesServiceBaseUrl}/images/upload-image`, formData);
            console.log(data);
            
        } catch (error) {
            console.log(error);
            
        }
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="courseName" className="text-right">
                                Course Name
                            </Label>
                            <Input
                                id="courseName"
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                                className="col-span-3"
                            />
                            <Label htmlFor="courseDescription" className="text-right">
                                Course Description
                            </Label>
                            <Textarea
                                id="courseDescription"
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
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
