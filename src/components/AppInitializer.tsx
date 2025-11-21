'use client';

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store"; // Use your typed hook!
import { rehydrateAuth } from "@/redux/features/authSlice";
import { Box, CircularProgress } from '@mui/material';

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      await dispatch(rehydrateAuth());
      
      // Mark as done to show the app
      setIsInitialized(true);
    };

    initApp();
  }, [dispatch]);

  // spinner while we are loading
  if (!isInitialized) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}