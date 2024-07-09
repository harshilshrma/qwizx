"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // corrected import
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase.js';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/components/ui/use-toast'; // Import useToast hook

const TakeQuizPage = () => {
    const router = useRouter();
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState<any>(null);
    const [answers, setAnswers] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { toast } = useToast(); // Initialize the toast hook

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const { data, error } = await supabase
                    .from('quizzes')
                    .select('*')
                    .eq('id', quizId)
                    .single();

                if (error) {
                    throw error;
                }

                setQuiz(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (quizId) {
            fetchQuiz();
        }
    }, [quizId]);

    const handleAnswerChange = (questionId: number, answerIndex: number) => {
        setAnswers((prevAnswers: any) => ({
            ...prevAnswers,
            [questionId]: answerIndex
        }));
    };

    const handleSubmit = () => {
        // Validate if all questions are answered
        for (let i = 0; i < quiz.questions.length; i++) {
            if (answers[i] === undefined) {
                toast({
                    title: "Error",
                    description: "Please answer all questions before submitting the quiz.",
                });
                return;
            }
        }

        let score = 0;
        quiz.questions.forEach((question: any, index: number) => {
            const correctAnswerIndex = question.correctAnswer;
            const userAnswerIndex = answers[index];

            if (userAnswerIndex === correctAnswerIndex) {
                score += 1;
            }
        });
        router.push(`/dashboard/result?score=${score}&total=${quiz.questions.length}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!quiz) {
        return <div>Quiz not found</div>;
    }

    return (
        <div className="container mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-4xl font-bold mb-2">{quiz.quiz_name}</CardTitle>
                    <CardDescription className="text-lg mb-6">{quiz.quiz_description}</CardDescription>
                    <Separator className="my-4" />
                    <p className="text-sm text-muted-foreground">Each question is worth 1 point. Please answer all questions. No questions should be left unanswered.</p>
                    <p className="text-sm text-destructive">Please do not refresh or navigate away from this page as doing so will cause you to lose your progress.</p>
                </CardHeader>
                <CardContent>
                    {quiz.questions.map((question: any, questionIndex: number) => (
                        <div key={questionIndex} className="mb-6">
                            <h2 className="font-semibold">{question.question}</h2>
                            <RadioGroup
                                value={answers[questionIndex] !== undefined ? String(answers[questionIndex]) : ''}
                                onValueChange={(value) => handleAnswerChange(questionIndex, Number(value))}
                                className="mt-2"
                            >
                                {question.options.map((option: string, optionIndex: number) => (
                                    <div key={optionIndex} className="flex items-center space-x-2 mb-2">
                                        <RadioGroupItem value={String(optionIndex)} id={`q${questionIndex}_o${optionIndex}`} />
                                        <Label htmlFor={`q${questionIndex}_o${optionIndex}`}>{option}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    ))}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSubmit}>Submit Quiz</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default TakeQuizPage;
