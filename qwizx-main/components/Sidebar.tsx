"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { AiOutlineEdit, AiOutlineQuestionCircle } from 'react-icons/ai';
import { BiSolidDashboard } from "react-icons/bi";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [selected, setSelected] = useState('');

    useEffect(() => {
        if (pathname.includes('take-quiz')) {
            setSelected('take-quiz');
        } else if (pathname.includes('create-quiz')) {
            setSelected('create-quiz');
        } else if (pathname.includes('dashboard')) {
            setSelected('dashboard');
        }
    }, [pathname]);

    const buttonClasses = (name: string) =>
        `sidebar-button w-full justify-start ${selected === name ? 'bg-primary text-primary-foreground' : ''}`;

    return (
        <aside className="w-[250px] flex flex-col items-start h-full p-4 bg-card text-card-foreground">
            <div className="flex flex-col w-full items-start justify-between space-y-2">
                <Button
                    variant='ghost'
                    onClick={() => router.push('/dashboard')}
                    className={buttonClasses('dashboard')}
                >
                    <BiSolidDashboard className="text-xl" />
                    <span className="ml-2">Dashboard</span>
                </Button>
                <Button
                    variant='ghost'
                    onClick={() => router.push('/dashboard/take-quiz')}
                    className={buttonClasses('take-quiz')}
                >
                    <AiOutlineQuestionCircle className="text-xl" />
                    <span className="ml-2">Take a Quiz</span>
                </Button>
                <Button
                    variant='ghost'
                    onClick={() => router.push('/dashboard/create-quiz')}
                    className={buttonClasses('create-quiz')}
                >
                    <AiOutlineEdit className="text-xl" />
                    <span className="ml-2">Create a Quiz</span>
                </Button>
            </div>
        </aside>
    );
};
