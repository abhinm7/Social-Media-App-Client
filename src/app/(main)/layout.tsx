'use client'

import { useSelector } from "react-redux";
import React from "react";
import { RootState } from "@/redux/rootReducer";
import { Box, CircularProgress } from "@mui/material";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSelector((state: RootState) => state.auth);

  if (status === "idle" || status === "loading") {
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
      <main>{children}</main>
    </div>
  );
}