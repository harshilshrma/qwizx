"use client";

import Image from "next/image";
import ModeToggle from "@/components/ModeToggle";
import GoogleSignIn from "@/components/GoogleSignIn";
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js"; // Import Session type
import { Progress } from "@/components/ui/progress"

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null); // Use proper type for session
  const [showLoading, setShowLoading] = useState(false); // State to control loading screen visibility
  const [progress, setProgress] = useState(13); // State to control progress bar

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    fetchSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
      setSession(session);
      if ((event === 'SIGNED_OUT') && (window.location.pathname === '/dashboard' || window.location.pathname === '/dashboard/create-quiz')) {
        window.location.href = '/';
      }
    });

  }, []);

  const handleSignIn = async () => {
    try {
      setShowLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      let currentProgress = 0;

      const interval = setInterval(() => {
        currentProgress += 25;
        if (currentProgress >= 100) {
          setProgress(100);
          clearInterval(interval);
          setTimeout(() => {
            router.push('/dashboard');
          }, 500);
        } else {
          setProgress(currentProgress);
        }
      }, 1000);
    } catch (error: any) {
      console.error('Error signing in:', error.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">

      <div className="text-center">
        <h1 className="text-5xl flex font-bold mb-4">Welcome to&nbsp;<div className='flex'>
          <p className='text-5xl font-bold'>Qwiz</p><span className='text-5xl text-primary font-bold'>X</span>
        </div></h1>
        {!session && <p className="text-xl font-medium text-primary mb-8">Sign in to get started</p>}
        <div className="flex items-center justify-center">
          <GoogleSignIn onSignIn={handleSignIn} />
        </div>
      </div>


      {showLoading && (
        <div className="pt-6 w-full h-full flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <Progress value={progress} className="w-[80%]" />
            <p className="text-lg mt-4 text-primary">Just a moment! We&apos;re taking you to the quiz paradise!</p>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
    </div>
  );
}
