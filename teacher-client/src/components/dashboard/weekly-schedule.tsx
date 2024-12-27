import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

type Course = {
    id: number;
    name: string;
};

type WeeklyScheduleProps = {
    courses: Course[];
};

export default function WeeklySchedule({ courses }: WeeklyScheduleProps) {
    // This is a simple mock schedule. In a real app, you'd fetch this data from an API.
    const mockSchedule = daysOfWeek.map((day) => ({
        day,
        courses: courses
            .filter(() => Math.random() > 0.5)
            .map((course) => ({
                ...course,
                time: `${Math.floor(Math.random() * 12 + 9)}:00`,
            })),
    }));

    return (
        <Tabs defaultValue={daysOfWeek[0].toLowerCase()} className="w-full">
            <TabsList className="grid w-full grid-cols-5 md:flex md:flex-wrap">
                {daysOfWeek.map((day) => (
                    <TabsTrigger
                        key={day}
                        value={day.toLowerCase()}
                        className="text-xs md:text-sm"
                    >
                        {day}
                    </TabsTrigger>
                ))}
            </TabsList>
            {mockSchedule.map(({ day, courses }) => (
                <TabsContent key={day} value={day.toLowerCase()}>
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="font-bold text-lg mb-2">{day}</h3>
                            <ul className="space-y-2">
                                {courses.map((course) => (
                                    <li key={course.id} className="text-sm">
                                        {course.time} - {course.name}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>
            ))}
        </Tabs>
    );
}
