import LoginForm from "@/components/home/login-form";
import LoadingPopup from "@/components/shared/loading-popup";
import { useState } from "react";

export default function HomePage() {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <LoginForm setIsLoading={setIsLoading} />
                {isLoading && <LoadingPopup text="Logging in..." />}
            </div>
        </div>
    );
}
