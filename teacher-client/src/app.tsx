import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingPage from "@/pages/loading-page";

const HomePage = React.lazy(() => import("@/pages/home-page"));

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
      </Routes>
    </div>
  );
}
