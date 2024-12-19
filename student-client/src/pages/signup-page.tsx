import RegistrationForm from "@/components/auth/registration-form";
import codingLoginPageImage from "@/assets/images/coding-login-page-image.webp";

export default function SignupPage() {
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
                <RegistrationForm />
            </div>
        </div>
    );
}
