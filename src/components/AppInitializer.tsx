"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { rehydrateAuth } from "@/redux/features/authSlice";
import type { AppDispatch } from "@/redux/store";

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(rehydrateAuth());
  }, [dispatch]);

  return <>{children}</>;
}
