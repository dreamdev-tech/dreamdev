import { Skeleton } from "@/components/ui/skeleton";

export function CourseListSkeleton() {
    return (
        <div className="flex flex-col items-center space-x-4 w-fit">
            {[1, 2, 3,4].map((i) => (
                <div key={i} className="flex flex-col items-center space-x-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-full w-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}
