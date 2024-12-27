"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, PlusCircle } from "lucide-react";
import CourseList from "@/components/dashboard/course-list";
import WeeklySchedule from "@/components/dashboard/weekly-schedule";
import CreateCourseModal from "@/components/dashboard/create-course-modal";
import ModeToggle from "@/components/theme/mode-toggle";

// Mock data
const initialCourses = [
    { id: 1, name: "Introduction to React" },
    { id: 2, name: "Advanced JavaScript" },
    { id: 3, name: "Web Design Fundamentals" },
];

export default function TeacherDashboard() {
    const [courses, setCourses] = useState(initialCourses);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleCreateCourse = (newCourse:string ) => {
        setCourses([...courses, { id: courses.length + 1, name: newCourse }]);
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col h-screen">
            <header className="p-4 shadow-md flex justify-between items-center">
                <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <Menu />
                </Button>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <aside
                    className={`w-64 p-6 shadow-md overflow-y-auto ${
                        isSidebarOpen ? "block" : "hidden"
                    } md:block`}
                >
                    <h2 className="text-2xl font-bold mb-6">My Courses</h2>
                    <CourseList courses={courses} />
                    <Button
                        className="w-full mt-4"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />{" "}
                        Create New Course
                    </Button>
                </aside>
                <main className="flex-1 p-6 overflow-y-auto">
                    <h2 className="text-3xl font-bold mb-6">Weekly Schedule</h2>
                    <WeeklySchedule courses={courses} />
                </main>
            </div>
            <CreateCourseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreateCourse={handleCreateCourse}
            />
            <ModeToggle />
        </div>
    );
}
