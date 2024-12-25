import { Loader2 } from "lucide-react";

export default function LoadingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <h2 className="text-2xl font-semibold mt-4 text-foreground">
                Loading...
            </h2>
        </div>
    );
}
