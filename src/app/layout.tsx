import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/redux/provider";
import { AppInitializer } from "@/components/AppInitializer";
import { Toaster } from 'react-hot-toast';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ThemeRegistry from "@/components/ThemeRegistry";


export const metadata: Metadata = {
  title: "Social Media App",
  description: "Interact each other",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <ReduxProvider>
            <AppInitializer>
              {children}
              <Toaster position="bottom-center" />
            </AppInitializer>
          </ReduxProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
