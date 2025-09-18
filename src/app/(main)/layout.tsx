'use client'

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { RootState } from "@/redux/rootReducer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, status } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    // Only redirect if auth check has finished AND user is not authenticated
    if (status === "failed" || (status === "succeeded" && !isAuthenticated)) {
      router.replace("/login");
    }
  }, [isAuthenticated, status, router]);

  // --- RENDER LOGIC ---

  // While still checking auth (optimistic), show loader
  if (status === "idle" || status === "loading") {
    return <div>Checking authentication...</div>;
  }

  // If explicitly failed (redirect will fire), show clear message
  if (status === "failed" || (status === "succeeded" && !isAuthenticated)) {
    return <div>Redirecting to login...</div>;
  }

  // Auth succeeded + user is logged in
  return (
    <div>
      <header>
        <h1>APP 1</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
