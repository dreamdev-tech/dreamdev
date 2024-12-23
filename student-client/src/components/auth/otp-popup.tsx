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

export default function InputOTPForm(
    { setOpenOtpPopup }: { setOpenOtpPopup: (value: boolean) => void },
) {
    const [otp, setOtp] = useState<string>("");
    const [errors, setErrors] = useState<string| null>(null);
    const formHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post(`${authServiceBaseUrl}/users/verify-otp`, {otp});
            console.log(res.data);
            
        } catch (error) {
            console.log(error);
            
        }
    };

    return (
        <form
            className="flex flex-col gap-4 items-center"
        onSubmit={formHandler}>
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
