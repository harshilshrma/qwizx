"use client"

import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react'

const QuizResultPageContent  = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const score = searchParams.get('score');
    const total = searchParams.get('total');

    const handleGoBack = () => {
        router.push('/dashboard/take-quiz');
    };

    return (
        <Suspense>
        <div className="container mx-auto">
            
                <Card className='h-[400px] shadow-md'>
                    <CardHeader>
                        <CardTitle className="text-4xl font-bold mb-2 text-primary">Quiz Results</CardTitle>
                        <CardDescription className="text-lg mb-6">Here&apos;s how you did!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <p className="text-2xl mb-4 ">Your Score: {score} / {total}</p>
                            <p className="text-xl mb-6">
                                {Number(score) >= Number(total) / 2 ?
                                    <span className='text-primary'>Great job! You passed!</span> : <span className=''>Don&apos;t worry, try again sometime later!</span>
                                }
                            </p>
                            <Button onClick={handleGoBack}>Go back to &apos;Take a Quiz&apos;</Button>
                        </div>
                    </CardContent>
                </Card>
            
        </div>
        </ Suspense>
    );
};

const QuizResultPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <QuizResultPageContent />
        </Suspense>
    );
};

export default QuizResultPage;
