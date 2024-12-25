import { ChangeEvent, FormEvent, useState } from "react";
import { AlertCircle, EyeIcon, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios-instance";
import { authServiceBaseUrl } from "@/lib/services-base-url";
import { SignupUserErrorsType, SignupUserType } from "@/types/auth-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AxiosError } from "axios";

export default function RegistrationForm(
    { setOpenOtpPopup }: { setOpenOtpPopup: (value: boolean) => void },
) {
    const [formData, setFormData] = useState<SignupUserType>({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
    });
    const [seePassword, setSeePassword] = useState(false);
    const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<SignupUserErrorsType>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = (): boolean => {
        const newErrors: SignupUserErrorsType = {};

        if (!formData.first_name) {
            newErrors.first_name = "First name is required";
        }
        if (!formData.last_name) newErrors.last_name = "Last name is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        if (formData.password !== formData.confirm_password) {
            newErrors.confirm_password = "Passwords do not match";
        }
        if (Object.keys(newErrors).length !== 0) {
            toast.error("Please fill in the required fields correctly", {
                duration: 3000,
                action: {
                    label: "Close",
                    onClick: (event) => event.cancelable,
                },
            });
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const res = await axiosInstance.post(
                    `${authServiceBaseUrl}/users/signup/email`,
                    formData,
                );
                localStorage.setItem("accessToken", res.data.access_token);
                localStorage.setItem("refreshToken", res.data.refresh_token);
                setOpenOtpPopup(true);
            } catch (error) {
                if (error instanceof AxiosError) {
                    toast.error(error.response?.data.error ? error.response?.data.error :"unexpected error", {
                        duration: 3000,
                        action: {
                            label: "Close",
                            onClick: (event) => event.cancelable,
                        },
                    });
                    return;
                }
                toast.error("An error occurred. Please try again later", {
                    duration: 3000,
                    action: {
                        label: "Close",
                        onClick: (event) => event.cancelable,
                    },
                });
            }
        }
    };
    const handleGoogleSignup = () => {
        window.location.href = `${authServiceBaseUrl}/oauth/google/login`;
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>
                    Please fill in your details to register.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                aria-invalid={!!errors.first_name}
                            />
                            {errors.first_name && (
                                <p className="text-sm text-red-500 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.first_name}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                aria-invalid={!!errors.last_name}
                            />
                            {errors.last_name && (
                                <p className="text-sm text-red-500 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.last_name}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.email}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="flex gap-1 items-center">
                            <Input
                                id="password"
                                name="password"
                                type={seePassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                aria-invalid={!!errors.password}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setSeePassword(!seePassword)}
                            >
                                {seePassword ? <EyeIcon /> : <EyeOff />}
                            </Button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-500 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.password}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                            Confirm Password
                        </Label>
                        <div className="flex gap-1 items-center">
                            <Input
                                id="confirmPassword"
                                name="confirm_password"
                                type={seeConfirmPassword ? "text" : "password"}
                                value={formData.confirm_password}
                                onChange={handleChange}
                                aria-invalid={!!errors.confirm_password}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() =>
                                    setSeeConfirmPassword(!seeConfirmPassword)}
                            >
                                {seeConfirmPassword ? <EyeIcon /> : <EyeOff />}
                            </Button>
                        </div>
                        {errors.confirm_password && (
                            <p className="text-sm text-red-500 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.confirm_password}
                            </p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button type="submit" className="w-full">Register</Button>
                    <Button
                        variant="outline"
                        className="w-full"
                        type="button"
                        onClick={handleGoogleSignup}
                    >
                        <FcGoogle />
                        Sign up with Google
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
