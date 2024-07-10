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
        `sidebar-button md:w-full w-[130px] justify-start ${selected === name ? 'bg-primary text-primary-foreground' : ''}`;

    return (
        <aside className="md:w-[200px] w-[170px] flex flex-col items-start h-full p-4 text-card-foreground">
            <div className="flex flex-col w-full items-start justify-between space-y-2">
                <Button
                    variant='ghost'
                    onClick={() => handleClick('dashboard', '/dashboard')}
                    className={buttonClasses('dashboard')}
                >
                    <BiSolidDashboard className="md:text-xl text-base" />
                    <span className="md:ml-2 ml-1 md:text-base text-xs">Dashboard</span>
                </Button>
                <Button
                    variant='ghost'
                    onClick={() => handleClick('take-quiz', '/dashboard/take-quiz')}
                    className={buttonClasses('take-quiz')}
                >
                    <AiOutlineQuestionCircle className="md:text-xl text-base" />
                    <span className="md:ml-2 ml-1 md:text-base text-xs">Take a Quiz</span>
                </Button>
                <Button
                    variant='ghost'
                    onClick={() => handleClick('create-quiz', '/dashboard/create-quiz')}
                    className={buttonClasses('create-quiz')}
                >
                    <AiOutlineEdit className="md:text-xl text-base" />
                    <span className="md:ml-2 ml-1 md:text-base text-xs">Create a Quiz</span>
                </Button>
            </div>
        </aside>
    );
};
