import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { LoginUserType } from "@/types/auth-types";
import { EyeIcon, EyeOff } from "lucide-react";
import axiosInstance from "@/lib/axios-instance";
import { authServiceBaseUrl } from "@/lib/services-base-url";
import { AxiosError } from "axios";
import { FcGoogle } from "react-icons/fc";

export function LoginForm() {
  const [login, setLogin] = useState<LoginUserType>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<string[]>([]);

  const [seePassword, setSeePassword] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(() => []);
    try {
      await axiosInstance.post(
        `${authServiceBaseUrl}/users/login/email`,
        login,
      );
      // Handle successful login
    } catch (error) {
      if (error instanceof AxiosError) {
        // Handle Axios error
        setErrors((prevErrors) => [...prevErrors, error.response?.data.error]);
      } else {
        // Handle other errors
        setErrors((prevErrors) => [
          ...prevErrors,
          "An unexpected error occurred",
        ]);
      }
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = `${authServiceBaseUrl}/oauth/google/login`;
  };
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              {errors.length > 0 &&
                errors.map((error, idx) => (
                  <li key={idx} className="font-bold text-red-700">
                    {error}
                  </li>
                ))}
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) =>
                  setLogin({
                    ...login,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link to="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type={seePassword ? "text" : "password"}
                  required
                  onChange={(e) =>
                    setLogin({
                      ...login,
                      password: e.target.value,
                    })
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setSeePassword(!seePassword)}
                >
                  {seePassword ? <EyeIcon /> : <EyeOff />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={handleGoogleLogin}
            >
              <FcGoogle />
              Login with Google
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
