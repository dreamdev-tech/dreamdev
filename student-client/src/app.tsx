import { Route, Routes, useNavigate, useSearchParams } from "react-router-dom";
import React, { Suspense, useEffect } from "react";
import LoadingPage from "@/pages/loading-page";
import Navbar from "@/components/common/navbar.tsx";
import Footer from "@/components/common/footer";

const HomePage = React.lazy(() => import("@/pages/home-page"));
const LoginPage = React.lazy(() => import("@/pages/login-page"));
const SignupPAge = React.lazy(() => import("@/pages/signup-page"));
const NotFoundPage = React.lazy(() => import("@/pages/not-found-page"));
const DashboardPage = React.lazy(() => import("@/pages/dashboard"));
const CoursePage = React.lazy(() => import("@/pages/course-page"));

export default function App() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      searchParams.delete("access_token");
      searchParams.delete("refresh_token");
      navigate(window.location.pathname, { replace: true });
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Suspense
              fallback={<LoadingPage />}
            >
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense
              fallback={<LoadingPage />}
            >
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path="/signup"
          element={
            <Suspense
              fallback={<LoadingPage />}
            >
              <SignupPAge />
            </Suspense>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Suspense
              fallback={<LoadingPage />}
            >
              <DashboardPage />
            </Suspense>
          }
        />
        <Route
          path="/course/:id"
          element={
            <Suspense
              fallback={<LoadingPage />}
            >
              <CoursePage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense
              fallback={<LoadingPage />}
            >
              <NotFoundPage />
            </Suspense>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}
