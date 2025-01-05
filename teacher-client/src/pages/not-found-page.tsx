import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
    const navigate = useNavigate();
    const navigateBack = () => navigate(-1);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-muted-foreground mb-8 text-center max-w-md">
                Oops! The page you're looking for doesn't exist or has been
                moved.
            </p>
            <div className="flex space-x-4">
                <Button asChild>
                    <Link to="/">
                        Return to Home
                    </Link>
                </Button>
                <Button variant="ghost" onClick={navigateBack}>
                    Go Back
                </Button>
            </div>
        </div>
    );
}
