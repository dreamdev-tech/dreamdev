import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import axiosInstance from "@/lib/axios-instance";
import { authServiceBaseUrl } from "@/lib/services-base-url";
import { Button } from "../ui/button";
import { AxiosError, AxiosResponse } from "axios";
import { SuccessfullAuthResponse } from "@/types/auth-types";
import { useNavigate } from "react-router-dom";

export default function InputOTPForm(
    { setOpenOtpPopup }: { setOpenOtpPopup: (value: boolean) => void },
) {
    const [otp, setOtp] = useState<string>("");
    const [errors, setErrors] = useState<string | null>(null);
    const navigate = useNavigate();
    const formHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res: AxiosResponse<SuccessfullAuthResponse, AxiosError> =
                await axiosInstance.post(
                    `${authServiceBaseUrl}/users/verify-otp`,
                    { otp },
                );
            localStorage.setItem("accessToken", res.data.access_token);
            localStorage.setItem("refreshToken", res.data.refresh_token);
            setOpenOtpPopup(false);
            setErrors(null);
            navigate("/dashboard");
        } catch (error) {
            if (error instanceof AxiosError) {
                switch (error.response?.status) {
                    case 400:
                        setErrors("Invalid OTP");
                        break;
                    case 500:
                        setErrors(
                            "Internal Server error please try again later",
                        );
                        break;
                    default:
                        setErrors("Something went wrong");
                        break;
                }
            }
        }
    };

    return (
        <form
            className="flex flex-col gap-4 items-center"
            onSubmit={formHandler}
        >
            {errors && <div className="text-red-500 text-sm">{errors}</div>}
            <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
            >
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>
            <Button type="submit" className="w-full">Verify OTP</Button>
        </form>
    );
}
