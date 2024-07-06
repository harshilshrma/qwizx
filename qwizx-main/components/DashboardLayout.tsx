"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function DashboardLayout ({ children}: {children: React.ReactNode}) {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setAuthenticated(false); // User is not authenticated
                // Redirect to home page after a delay
                setTimeout(() => {
                    window.location.href = '/';
                }, 500);
            } else {
                setAuthenticated(true); // User is authenticated
            }
        };

        checkAuth();
    }, []);

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <main className="w-2/3 p-4">
                    {children}
                </main>
            </div>
        </div>
    );
};

