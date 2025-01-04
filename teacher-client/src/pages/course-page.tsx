import { AddChapterModal } from "@/components/course/add-chapter-modal";
import CourseChapters from "@/components/course/course-chapters";
import CourseDescription from "@/components/course/course-description";
import axiosInstance from "@/lib/axios-instance";
import { teacherServiceBaseUrl } from "@/lib/services-base-url";
import { GetCourseWithChaptersResponse } from "@/types/course-types";
import { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function CoursePage() {
    const { courseId } = useParams();
    const [course, setCourse] = useState<GetCourseWithChaptersResponse | null>(
        null,
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data }: AxiosResponse<
                    { course: GetCourseWithChaptersResponse },
                    AxiosError
                > = await axiosInstance.get(
                    `${teacherServiceBaseUrl}/course/get-course/${courseId}`,
                );
                setCourse(data.course);
                console.log(data.course);
                
            } catch (error) {
                if (error instanceof AxiosError) {
                    console.log(error);
                }
            }
        };
        fetchCourse();
    }, [courseId]);
    return (
        <div className="min-h-screen flex flex-col">
            {course && (
                <CourseDescription
                    course_name={course.course_name}
                    course_description={course.course_description}
                    course_image_url={course.course_image_url}
                    is_verified={course.is_verified}
                />
            )}
            <h2 className="text-3xl font-semibold mb-8 text-center">
                Course Chapters:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {course?.chapters && (
                    <CourseChapters
                        chapters={course.chapters}
                        setIsModalOpen={setIsModalOpen}
                    />
                )}
            </div>
            {course && (
                <AddChapterModal
                    isOpen={isModalOpen}
                    setIsOpen={setIsModalOpen}
                    setCourse={setCourse}
                />
            )}
        </div>
    );
}
