"use client"

import Image from "next/image";
import ModeToggle from "@/components/ModeToggle";
import GoogleSignIn from "@/components/GoogleSignIn";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/create-quiz');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to QwizX</h1>
        <p className="text-lg text-primary mb-8">Sign in to get started</p>
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
