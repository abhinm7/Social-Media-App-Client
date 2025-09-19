import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/redux/provider";
import { AppInitializer } from "@/components/AppInitializer";
import { Toaster } from 'react-hot-toast';
import ThemeRegistry from "@/components/ThemeRegistry";
import { roboto, bitcount } from './fonts'; 
import Navbar from "@/components/layouts/Navbar";

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
    <html lang="en" className={`${roboto.variable} ${bitcount.variable}`}>
      <body>
        <ThemeRegistry>
          <ReduxProvider>
            <AppInitializer>
              <Navbar/>
              {children}
              <Toaster position="bottom-center" />
            </AppInitializer>
          </ReduxProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}