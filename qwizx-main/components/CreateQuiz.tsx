"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from '@/lib/supabase';
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const quizSchema = z.object({
    quizName: z.string().min(4, { message: "Quiz name must be at least 4 characters." }),
    quizDescription: z.string().min(10, { message: "Description must be at least 10 characters." }),
    questions: z.array(
        z.object({
            question: z.string().min(5, { message: "Question must be at least 5 characters." }),
            options: z.array(z.string().min(1, { message: "Option cannot be empty." })).length(4, { message: "Each question must have exactly 4 options." }),
            correctAnswer: z.number().min(0, { message: "Please select a valid option." }).max(3, { message: "Please select a valid option." })
        })
    ).max(10)
});

export default function CreateQuiz() {
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(quizSchema),
        defaultValues: {
            quizName: "",
            quizDescription: "",
            questions: [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }]
        }
    });

    const { fields: questionFields, append: appendQuestion } = useFieldArray({
        control: form.control,
        name: "questions"
    });

    const handleAddQuestion = () => {
        if (questionFields.length >= 10) {
            toast({
                title: "Limit reached",
                description: "You can only add up to 10 questions."
            });
            return;
        }
        appendQuestion({ question: "", options: ["", "", "", ""], correctAnswer: 0 });
    };

    const handleCreateQuiz = async (values: { quizName: string; quizDescription: string; questions: { question: string, options: string[], correctAnswer: number }[]; }) => {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;

        if (user) {
            // Check for duplicate quiz name
            const { data: existingQuiz, error: fetchError } = await supabase
                .from('quizzes')
                .select('id')
                .eq('quiz_name', values.quizName)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                console.error('Error checking for duplicate quiz:', fetchError);
                toast({
                    title: "Error",
                    description: "There was an error checking for duplicate quizzes.",
                });
                return;
            }

            if (existingQuiz) {
                toast({
                    title: "Duplicate Quiz",
                    description: "A quiz with this name already exists.",
                });
                return;
            }

            const { error } = await supabase.from('quizzes').insert([
                {
                    user_id: user.id,
                    quiz_name: values.quizName,
                    quiz_description: values.quizDescription,
                    questions: values.questions,
                    created_at: new Date()
                }
            ]);

            if (error) {
                console.error('Error creating quiz:', error);
                toast({
                    title: "Error",
                    description: "There was an error creating the quiz.",
                });
            } else {
                toast({
                    title: "Quiz created successfully!",
                    description: "Your quiz has been created and saved.",
                });
                form.reset({
                    quizName: "",
                    quizDescription: "",
                    questions: [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }]
                });
            }
        }
    };

    return (
        <Form {...form}>
            <h1 className="text-4xl font-bold mb-2 text-primary">Create a Quiz</h1>
            <p className="text-lg mb-2">Welcome to the quiz creation page. Please fill out the details below to create your quiz.</p>
            <p className="text-lg mb-2">Here are some basic rules to follow:</p>
            <ul className="list-disc list-inside mb-6">
                <li>The quiz name must be at least 4 characters long.</li>
                <li>The quiz description must be at least 10 characters long.</li>
                <li>Each question must have exactly 4 options.</li>
                <li>You can create up to 10 questions for each quiz.</li>
            </ul>
            <Separator className="" />
            <form onSubmit={form.handleSubmit(handleCreateQuiz)} className="space-y-8">
                <div className="flex gap-4 mt-6">
                    <FormField
                        control={form.control}
                        name="quizName"
                        render={({ field }) => (
                            <FormItem className="w-1/4">
                                <FormLabel>Quiz Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter quiz name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="quizDescription"
                        render={({ field }) => (
                            <FormItem className="w-3/4">
                                <FormLabel>Quiz Description</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter quiz description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {questionFields.map((item, qIndex) => (
                    <div key={item.id} className="space-y-2 border-2 border-primary p-4 rounded-md">
                        <FormField
                            control={form.control}
                            name={`questions.${qIndex}.question`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Question {qIndex + 1}</FormLabel>
                                    <FormControl>
                                        <Input className="" placeholder="Enter question" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-4">
                            {item.options.map((_, oIndex) => (
                                <FormField
                                    key={oIndex}
                                    control={form.control}
                                    name={`questions.${qIndex}.options.${oIndex}`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Option {oIndex + 1}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={`Enter Option ${oIndex + 1}`} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                        <FormField
                            control={form.control}
                            name={`questions.${qIndex}.correctAnswer`}
                            render={({ field }) => (
                                <FormItem className="w-1/4">
                                    <FormLabel>Correct Answer</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value.toString()}
                                            onValueChange={(value) => field.onChange(parseInt(value, 10))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select the correct option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Select the correct option number:</SelectLabel>
                                                    {item.options.map((option, oIndex) => (
                                                        <SelectItem key={oIndex} value={oIndex.toString()}>
                                                            Option {oIndex + 1}: {option}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                ))}
                <div className="flex gap-4">
                    <Button type="button" variant={"secondary"} onClick={handleAddQuestion}>
                        + Add Question
                    </Button>
                    <Button type="submit">
                        Create Quiz
                    </Button>
                </div>
            </form>
        </Form>
    );
}
