import RegistrationForm from "@/components/auth/registration-form";
import codingLoginPageImage from "@/assets/images/coding-login-page-image.webp";
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import InputOTPForm from "@/components/auth/otp-popup";
export default function SignupPage() {
    const [openOtpPopup, setOpenOtpPopup] = useState(false);
    return (
        <div className="grid w-full min-h-screen grid-cols-1 lg:grid-cols-2 gap-4 p-4">
            <img
                src={codingLoginPageImage}
                alt="Illustration for coding signup page"
                className="rounded-sm object-cover w-full h-full"
                loading="eager"
                onError={(e) => {
                    e.currentTarget.src = codingLoginPageImage;
                }}
            />
            <div className="flex items-center justify-center">
                <RegistrationForm
                setOpenOtpPopup={setOpenOtpPopup}
                />
                <Dialog open={openOtpPopup}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>One time password</DialogTitle>
                            <DialogDescription>
                                We have sent a one-time password to your email. Please enter the OTP to verify your account.
                                <InputOTPForm />
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
