"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function Sidebar () {
    const router = useRouter();

    return (
        <aside className="w-1/3 h-full p-4">
            <Button onClick={() => router.push('/dashboard/take-quiz')} className="w-full mb-2">Take a Quiz</Button>
            <Button onClick={() => router.push('/dashboard/create-quiz')} className="w-full mb-2">Create a Quiz</Button>
        </aside>
    );
};
