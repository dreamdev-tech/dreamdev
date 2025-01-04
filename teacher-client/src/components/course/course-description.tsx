import { cn } from "@/lib/utils";

export default function CourseDescription(
    { course_name, course_description, course_image_url, is_verified }: {
        course_name: string;
        course_description: string;
        course_image_url: string;
        is_verified: boolean;
    },
) {
    const imageUrl = process.env.NODE_ENV === "development"
        ? `http://${course_image_url}`
        : `https://${course_image_url}`;
    return (
        <div className="flex-1 flex items-center justify-center ">
            <div className="max-w-4xl w-full px-4 py-8">
                <img
                    src={imageUrl}
                    alt={course_name}
                    width={800}
                    height={300}
                    className="rounded-lg shadow-md mb-6"
                    loading="lazy"
                />
                <h1 className="text-4xl font-bold mb-4 text-center">
                    {course_name}
                </h1>
                <p
                    className={cn(
                        "text-xl text-center mb-4",
                        is_verified ? "text-green-500" : "text-red-500",
                    )}
                >
                    {is_verified ? "Verified" : "Not Verified"}
                </p>
                <p className="text-xl text-center mb-8">{course_description}</p>
            </div>
        </div>
    );
}
