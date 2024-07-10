import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from './ui/button';
import { CalendarDays } from "lucide-react";
import { useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";
import ShareButton from './ShareButton';


interface Quiz {
    id: string;
    quiz_name: string;
    quiz_description: string;
    created_at: string; // Assuming it's a string for date display
    questions: any[]; // Adjust as per your actual data structure
}

const Home = () => {
    const router = useRouter();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]); // Specify the type using generics

    useEffect(() => {
        async function fetchQuizzes() {
            try {
                const { data, error } = await supabase
                    .from('quizzes')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    throw error;
                }

                setQuizzes(data || []);
            } catch (error: any) {
                console.error('Error fetching quizzes:', error.message);
            }
        }

        fetchQuizzes();
    }, []);

    const handleTakeQuiz = (quizId: string) => {
        console.log(`Taking quiz with ID: ${quizId}`);
        router.push(`/dashboard/take-quiz/${quizId}`);
    };

    return (
        <div className="">
            <h1 className="md:text-4xl text-2xl font-bold mb-2 text-primary">Take a Quiz</h1>
            <p className="md:text-lg text-xs mb-6">Explore and take any of these available quizzes created by users just like you. Share them with your friends and challenge each other!</p>
            <Separator className="" />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6'>
                {quizzes.map((quiz) => (
                    <Card key={quiz.id} className="md:w-[380px] w-full shadow-md flex flex-col justify-around">
                        <CardHeader >
                            <div className="flex items-center pb-2">
                                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                                <span className="text-xs text-muted-foreground">
                                    Created on {new Date(quiz.created_at).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST
                                </span>
                            </div>
                            <CardTitle className='capitalize'>{quiz.quiz_name}</CardTitle>
                            <CardDescription className=''>{quiz.quiz_description}</CardDescription>
                        </CardHeader>
                        <CardContent>

                        </CardContent>


                        <CardFooter className="flex flex-col gap-2 w-full">
                            <div className='flex w-full'>
                                <p className="text-base">Total Questions: <span className='text-primary'>{quiz.questions.length}</span></p>
                            </div>
                            <div className='flex gap-2 w-full'>
                                <Button onClick={() => handleTakeQuiz(quiz.id)}>Take Quiz</Button>
                                <ShareButton quizLink={`https://yourdomain.com/dashboard/take-quiz/${quiz.id}`} />
                            </div>
                        </CardFooter>


                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Home;
