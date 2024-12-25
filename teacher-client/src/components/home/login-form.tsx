import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.webp";
import ModeToggle from "../theme/mode-toggle";
import { useState } from "react";
import { LoginType } from "@/types/auth-types";
import axiosInstance from "@/lib/axios-instance";
import { teacherServiceBaseUrl } from "@/lib/services-base-url";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [loginData, setLoginData] = useState<LoginType>({
        email: "",
        password: "",
    });
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post(
                `${teacherServiceBaseUrl}/auth/login`,
                loginData,
            );
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <ModeToggle />
            <Card className="overflow-hidden">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">
                                    Welcome back
                                </h1>
                                <p className="text-balance text-muted-foreground">
                                    Login to your teacher account
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={loginData.email}
                                    onChange={(e) =>
                                        setLoginData({
                                            ...loginData,
                                            email: e.target.value,
                                        })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={loginData.password}
                                    onChange={(e) =>
                                        setLoginData({
                                            ...loginData,
                                            password: e.target.value,
                                        })}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </div>
                    </form>
                    <div className="relative hidden bg-muted md:block">
                        <img
                            src={logo}
                            alt="edudev-logo"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
