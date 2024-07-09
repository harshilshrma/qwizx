import { Copy, MoveRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useRef } from "react"
import { IoMdShare } from "react-icons/io";

interface ShareButtonProps {
    quizLink: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ quizLink }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const audio = new Audio('/pop.mp3');
        audioRef.current = audio;
    }, []);

    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type="submit" variant="outline" size={"icon"} className="shadow-md"><IoMdShare className="h-4 w-4" /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-left">Share this Quiz</DialogTitle>
                    <DialogDescription className="text-left">
                        Grab the link to this quiz and share it with your friends!
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Quiz Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={quizLink}
                            readOnly
                        />
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        className="px-3"
                        onClick={() => {
                            playSound();
                            navigator.clipboard.writeText(quizLink);
                            toast({
                                title: 'Quiz Link copied!',
                                description: 'The link has been copied to your clipboard.',
                            });
                        }}>
                        <span className="sr-only">Copy</span>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ShareButton;
