"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Question {
    question: string;
    correctAnswer: string;
    userAnswer: string;
}

const QuizResultPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const score = searchParams.get('score');
    const total = searchParams.get('total');
    const questions = JSON.parse(searchParams.get('questions') || '[]') as Question[];

    const wrongAnswers = questions.filter(q => q.correctAnswer !== q.userAnswer);

    const handleGoBack = () => {
        router.push('/dashboard/take-quiz');
    };

    return (
        <div className="container mx-auto">
            <Card className='h-auto shadow-md'>
                <CardHeader>
                    <CardTitle className="text-4xl font-bold mb-2 text-primary">Quiz Results</CardTitle>
                    <CardDescription className="text-lg mb-6">Here&apos;s how you did!</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center">
                        <p className="text-2xl mb-4">Your Score: {score} / {total}</p>
                        <p className="text-xl mb-6">
                            {Number(score) >= Number(total) / 2 ? (
                                <span className='text-primary'>Great job! You passed!</span>
                            ) : (
                                <span className=''>Don&apos;t worry, try again sometime later!</span>
                            )}
                        </p>
                        {wrongAnswers.length > 0 && (
                            <div className="text-left mt-6">
                                <h2 className="text-xl font-bold mb-4">Answers You Got Wrong:</h2>
                                {wrongAnswers.map((q, index) => (
                                    <div key={index} className="mb-4">
                                        <p className="text-lg"><strong>Question:</strong> {q.question}</p>
                                        <p className="text-lg text-red-500"><strong>Your Answer:</strong> {q.userAnswer}</p>
                                        <p className="text-lg text-green-500"><strong>Correct Answer:</strong> {q.correctAnswer}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <Button onClick={handleGoBack}>Go back to &apos;Take a Quiz&apos;</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default QuizResultPage;
