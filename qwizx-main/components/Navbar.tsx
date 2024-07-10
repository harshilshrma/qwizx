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
import { supabase } from '../lib/supabase';



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
            router.push('/');
        }
    };

    return (
        <nav className="flex items-center justify-between p-4 relative">
            <Link href="/dashboard">
                <div className='flex flex-col items-left'>
                    <div className='flex'>
                        <p className='md:text-5xl text-3xl font-bold'>Qwiz</p><span className='md:text-5xl text-3xl text-primary font-bold'>X</span>
                    </div>
                    <p className='md:text-sm text-xs text-primary font-medium'>the fun way to get smarter. </p>
                </div>
            </Link>

            <div className='flex justify-end gap-4'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="hover:bg-primary ">
                            <UserRound className="h-4 w-4" />&nbsp;&nbsp;Profile
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Hey! SmartPants</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut} className='font-medium'>Sign Out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <ModeToggle />
            </div>

            {/* {isMenuOpen && (
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
            )} */}
        </nav>
    );
}

export default Navbar;
