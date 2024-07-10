"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
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
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

const quizSchema = z.object({
    quizName: z.string().min(4, { message: "Quiz name must be at least 4 characters." }),
    quizDescription: z.string().min(10, { message: "Description must be at least 10 characters." }),
    questions: z.array(
        z.object({
            question: z.string().min(5, { message: "Question must be at least 5 characters." }),
            options: z.array(z.string().min(1, { message: "Option cannot be empty." })).length(4, { message: "Each question must have exactly 4 options." }),
            correctAnswer: z.number().min(0).max(3, { message: "Correct answer must be a valid option index (0-3)." })
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

    const [showAlertDialog, setShowAlertDialog] = useState(false);
    const [showLimitAlertDialog, setShowLimitAlertDialog] = useState(false);
    const [showDuplicateAlertDialog, setShowDuplicateAlertDialog] = useState(false);

    const handleAddQuestion = () => {
        if (questionFields.length >= 10) {
            setShowLimitAlertDialog(true);
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
                setShowDuplicateAlertDialog(true);
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
                setShowAlertDialog(true);
                form.reset({
                    quizName: "",
                    quizDescription: "",
                    questions: [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }]
                });
            }
        }
    };

    return (
        <>
            <Form {...form}>
                <h1 className="md:text-4xl text-2xl font-bold mb-2 text-primary">Create a Quiz</h1>
                <p className="md:text-lg text-xs mb-2">Welcome to the quiz creation page. Please fill out the details below to create your quiz.</p>
                <p className="md:text-lg text-xs mb-2">Here are some basic rules to follow:</p>
                <ul className="list-disc md:text-lg text-xs list-inside mb-6">
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
                                    <FormLabel className="">Quiz Name</FormLabel>
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
                                            <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value.toString()}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Correct Option" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="0">Option 1</SelectItem>
                                                        <SelectItem value="1">Option 2</SelectItem>
                                                        <SelectItem value="2">Option 3</SelectItem>
                                                        <SelectItem value="3">Option 4</SelectItem>
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
                        <Button type="button" onClick={handleAddQuestion}>
                            + Add Question
                        </Button>
                        <Button type="submit">
                            Create Quiz
                        </Button>
                    </div>
                </form>
            </Form>

            {/* Success Alert Dialog */}
            <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Quiz Submitted</AlertDialogTitle>
                        <AlertDialogDescription>
                            We&apos;ve received your quiz. Our team will review it, and if valid, it will be published in the &apos;Take a Quiz&apos; section.
                        </AlertDialogDescription>
                        <AlertDialogDescription>Thank you!</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowAlertDialog(false)}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Limit Exceeded Alert Dialog */}
            <AlertDialog open={showLimitAlertDialog} onOpenChange={setShowLimitAlertDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Question Limit Exceeded</AlertDialogTitle>
                        <AlertDialogDescription>
                            You cannot add more than 10 questions to a quiz.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowLimitAlertDialog(false)}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Duplicate Quiz Name Alert Dialog */}
            <AlertDialog open={showDuplicateAlertDialog} onOpenChange={setShowDuplicateAlertDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Duplicate Quiz Name</AlertDialogTitle>
                        <AlertDialogDescription>
                            A quiz with the same name already exists. Please choose a different name.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowDuplicateAlertDialog(false)}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
