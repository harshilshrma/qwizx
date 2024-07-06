"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { AiOutlineEdit, AiOutlineQuestionCircle } from 'react-icons/ai';
import { BiSolidDashboard } from "react-icons/bi";
import { useEffect, useState } from 'react';

export default function Sidebar() {
    const router = useRouter();
    const [selected, setSelected] = useState('dashboard');

    const handleClick = (name: string, path: string) => {
        setSelected(name);
        router.push(path);
    };

    useEffect(() => {
        if (selected === 'dashboard') {
            router.push('/dashboard');
        }
    }, [selected, router]);

    const buttonClasses = (name: string) =>
        `sidebar-button w-full justify-start ${selected === name ? 'bg-primary text-primary-foreground' : ''}`;

    return (
        <aside className="w-[200px] flex flex-col items-start h-full p-4 text-card-foreground">
            <div className="flex flex-col w-full items-start justify-between space-y-2">
                <Button
                    variant='ghost'
                    onClick={() => handleClick('dashboard', '/dashboard')}
                    className={buttonClasses('dashboard')}
                >
                    <BiSolidDashboard className="text-xl" />
                    <span className="ml-2">Dashboard</span>
                </Button>
                <Button
                    variant='ghost'
                    onClick={() => handleClick('take-quiz', '/dashboard/take-quiz')}
                    className={buttonClasses('take-quiz')}
                >
                    <AiOutlineQuestionCircle className="text-xl" />
                    <span className="ml-2">Take a Quiz</span>
                </Button>
                <Button
                    variant='ghost'
                    onClick={() => handleClick('create-quiz', '/dashboard/create-quiz')}
                    className={buttonClasses('create-quiz')}
                >
                    <AiOutlineEdit className="text-xl" />
                    <span className="ml-2">Create a Quiz</span>
                </Button>
            </div>
        </aside>
    );
};
