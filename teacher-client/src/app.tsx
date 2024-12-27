import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingPage from "@/pages/loading-page";

const HomePage = React.lazy(() => import("@/pages/home-page"));
const DashboardPage = React.lazy(() => import("@/pages/dashboard-page"));

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
      </Routes>
    </div>
  );
}
