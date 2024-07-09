"use client"

import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const QuizResultPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const score = searchParams.get('score');
    const total = searchParams.get('total');

    const handleGoBack = () => {
        router.push('/dashboard');
    };

    return (
        <div className="container mx-auto">
            <Card className='h-[400px] shadow-md'>
                <CardHeader>
                    <CardTitle className="text-4xl font-bold mb-2 text-primary">Quiz Results</CardTitle>
                    <CardDescription className="text-lg mb-6">Here's how you did!</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center">
                        <p className="text-2xl mb-4 ">Your Score: {score} / {total}</p>
                        <p className="text-xl mb-6">
                            {Number(score) >= Number(total) / 2 ?
                                <span className='text-primary'>Great job! You passed!</span> : <span className=''>Don't worry, try again sometime later!</span>
                            }
                        </p>
                        <Button onClick={handleGoBack}>Go to Dashboard</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default QuizResultPage;
