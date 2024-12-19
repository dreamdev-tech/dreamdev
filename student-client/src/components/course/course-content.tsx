import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    // Sidebar,
    // SidebarContent,
    // SidebarHeader,
    // SidebarMenu,
    // SidebarMenuButton,
    // SidebarMenuItem,
    SidebarProvider,
} from "@/components/ui/sidebar";
import { chapters } from "@/helpers/placeholders";

export function CourseContent() {
    const [selectedChapter, _] = useState<number | null>(null);

    return (
        <SidebarProvider>
            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
                {/* <Sidebar>
                    <SidebarHeader>
                        <h2 className="text-lg font-semibold px-4 py-2">
                            Chapters
                        </h2>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            {chapters.map((chapter) => (
                                <SidebarMenuItem key={chapter.id}>
                                    <SidebarMenuButton
                                        onClick={() =>
                                            setSelectedChapter(chapter.id)}
                                        isActive={selectedChapter ===
                                            chapter.id}
                                    >
                                        {chapter.title}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarContent>
                </Sidebar> */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {selectedChapter
                                ? chapters.find((c) => c.id === selectedChapter)
                                    ?.title
                                : "Select a chapter"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedChapter
                            ? (
                                <p>
                                    This is the content for chapter{" "}
                                    {selectedChapter}. Replace this with actual
                                    course content.
                                </p>
                            )
                            : (
                                <p>
                                    Please select a chapter from the sidebar to
                                    view its content.
                                </p>
                            )}
                    </CardContent>
                </Card>
            </div>
        </SidebarProvider>
    );
}
