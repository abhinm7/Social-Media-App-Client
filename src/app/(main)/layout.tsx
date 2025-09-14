'use client'

import { useSelector, UseSelector } from "react-redux";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { RootState } from "@/redux/store";
import { stat } from "fs";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated, status } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (status !== 'loading' && status !== 'idle' && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, status, router]);

    if (status === 'loading' || status === 'idle' || !isAuthenticated) {
        return <div>Loading session...</div>
    }

    return (
        <>
            <div>
                <header>
                    <h1>
                        APP 1
                    </h1>
                    {/* button <logOutButton /> */}
                </header>
                <main>
                    {children}
                </main>
            </div>
        </>
    );
}