import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
    return (
        <div className="flex flex-col md:flex-row h-screen w-full items-center justify-center px-4">
            <LoginForm />
        </div>
    );
}
