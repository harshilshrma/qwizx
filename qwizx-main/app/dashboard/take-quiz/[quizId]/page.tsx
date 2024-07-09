"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const TakeQuizPage = () => {
    const router = useRouter();
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState<any>(null);
    const [answers, setAnswers] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const handleAnswerChange = (questionId: string, answerIndex: number) => {
        setAnswers({
            ...answers,
            [questionId]: answerIndex
        });
    };

    const handleSubmit = () => {
        let score = 0;
        quiz.questions.forEach((question: any, index: number) => {
            const correctAnswerIndex = question.correctAnswer;
            const userAnswerIndex = answers[question.id];

            if (userAnswerIndex === correctAnswerIndex) {
                score += 1;
            }
        });
        router.push(`/dashboard/quiz-result?score=${score}&total=${quiz.questions.length}`);
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
                </CardHeader>
                <CardContent>
                    {quiz.questions.map((question: any) => (
                        <div key={question.id} className="mb-6">
                            <h2 className="font-semibold">{question.question}</h2>
                            <RadioGroup
                                value={answers[question.id] !== undefined ? String(answers[question.id]) : ''}
                                onValueChange={(value) => handleAnswerChange(question.id, Number(value))}
                                className="mt-2"
                            >
                                {question.options.map((option: string, index: number) => (
                                    <RadioGroupItem key={index} value={String(index)} className="mb-2">
                                        {option}
                                    </RadioGroupItem>
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
