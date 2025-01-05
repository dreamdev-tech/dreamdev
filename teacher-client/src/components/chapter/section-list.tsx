import { ChapterSectionResponseType } from "@/types/chapter-types";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function SectionList(
    { sections }: { sections: ChapterSectionResponseType[] },
) {
    return (
        <div className="space-y-4">
            {sections.map((section) => (
                <Card
                    key={section.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                >
                    <CardHeader>
                        {section.title &&
                            (
                                <CardTitle>
                                    {section.title}
                                </CardTitle>
                            )}
                        <CardDescription>{section.text}</CardDescription>
                    </CardHeader>
                </Card>
            ))}
            <Button className="w-full">
                Add New Chapter
            </Button>
        </div>
    );
}
