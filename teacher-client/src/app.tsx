import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingPage from "@/pages/loading-page";

const HomePage = lazy(() => import("@/pages/home-page"));
const DashboardPage = lazy(() => import("@/pages/dashboard-page"));
const CoursePage = lazy(() => import("@/pages/course-page"));
const ChapterPage = lazy(() => import("@/pages/chapter-page"));
const NotFoundPage = lazy(() => import("@/pages/not-found-page"));
export default function App() {
  return (
    <div className="">
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingPage />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<LoadingPage />}>
              <DashboardPage />
            </Suspense>
          }
        />
        <Route
          path="/course/:courseId"
          element={
            <Suspense fallback={<LoadingPage />}>
              <CoursePage />
            </Suspense>
          }
        />
        <Route
          path="/chapter/:courseId/:chapterId"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ChapterPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<LoadingPage />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Routes>
    </div>
  );
}
