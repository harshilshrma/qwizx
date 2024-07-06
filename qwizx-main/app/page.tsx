"use client"

import Image from "next/image";
import ModeToggle from "@/components/ModeToggle";
import GoogleSignIn from "@/components/GoogleSignIn";
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js"; // Import Session type

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null); // Use proper type for session

  const handleSignIn = () => {
    router.push('/dashboard');
  };

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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-5xl flex font-bold mb-4">Welcome to&nbsp;<div className='flex'>
          <p className='text-5xl font-bold'>Qwiz</p><span className='text-5xl text-primary font-bold'>X</span>
        </div></h1>
        <p className="text-xl font-medium text-primary mb-8">Sign in to get started</p>
      </div>

      <div className="flex items-center justify-center">
        <GoogleSignIn onSignIn={handleSignIn} />
      </div>

      <div className="absolute top-4 right-4">  
        <ModeToggle />
      </div>
    </div>
  );
}
