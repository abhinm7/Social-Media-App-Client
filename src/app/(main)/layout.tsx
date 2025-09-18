'use client'

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { RootState } from "@/redux/rootReducer";
import { Box, CircularProgress } from "@mui/material";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, status } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    if (status === "failed" || (status === "succeeded" && !isAuthenticated)) {
      router.replace("/login");
    }
  }, [isAuthenticated, status, router]);

  if (status === "idle" || status === "loading" || !isAuthenticated) {
    return (
        <Box 
            sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}
        >
            <CircularProgress />
        </Box>
    );
  }

  return (
    <div>
      <header>
        <h1>APP 1</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}