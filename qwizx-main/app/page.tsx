"use client"

import Image from "next/image";
import ModeToggle from "@/components/ModeToggle";
import GoogleSignIn from "@/components/GoogleSignIn";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <ModeToggle />
      <GoogleSignIn onSignIn={handleSignIn} />
    </div>
  );
}
