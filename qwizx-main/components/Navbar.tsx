"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Image from "next/image";
import { useTheme } from 'next-themes';
import ModeToggle from './ModeToggle';
import { useRouter } from 'next/navigation';
import { UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { supabase } from '../lib/supabase'; // Adjust this path as per your project structure

const Navbar = () => {
    const { theme } = useTheme();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsDarkMode(theme === 'dark');
    }, [theme]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Sign out error:', error.message);
        } else {
            console.log('User signed out successfully');
            router.push('/'); // Redirect to homepage after sign-out
        }
    };

    return (
        <nav className="flex items-center justify-between p-4 relative">
            <p className='text-4xl font-bold'>
                QwizX
            </p>

            <div className='flex justify-end gap-6'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <UserRound className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Hey! SmartPants</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <ModeToggle />
            </div>

            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-background z-50">
                    <div className="flex flex-col items-center py-4 space-y-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="ml-4">
                                    <Image src="/upvote.jpeg" alt="Profile" height={24} width={24} className="rounded-full" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Hi, </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
