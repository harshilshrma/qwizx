"use client"
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function Dashboard({children}: {children: React.ReactNode}) {
    <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-1">
            <Sidebar />
            <main className="w-2/3 p-4">
                {children}
            </main>
        </div>
    </div>
}