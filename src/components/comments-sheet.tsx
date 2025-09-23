"use client";

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { MessageSquare, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';

const fakeComments = [
    {
        id: 1,
        author: "Alex",
        avatar: "/avatars/01.png",
        content: "Wow, this chapter was intense! I didn't see that coming.",
        timestamp: "2 hours ago"
    },
    {
        id: 2,
        author: "Maria",
        avatar: "/avatars/02.png",
        content: "I have a theory about the Crimson Cipher. What if it's not a code, but a map?",
        timestamp: "1 hour ago"
    },
    {
        id: 3,
        author: "David",
        avatar: "/avatars/03.png",
        content: "The world-building is incredible. Elara Vance is a genius.",
        timestamp: "30 minutes ago"
    },
    {
        id: 4,
        author: "Sophia",
        avatar: "/avatars/04.png",
        content: "I'm so invested in the main character's journey. Can't wait to see what happens next!",
        timestamp: "10 minutes ago"
    }
]

export function CommentsSheet() {
    const [comments, setComments] = useState(fakeComments);
    const [newComment, setNewComment] = useState("");

    const handlePostComment = () => {
        if (newComment.trim()) {
            const newCommentObj = {
                id: comments.length + 1,
                author: "You",
                avatar: "/avatars/05.png",
                content: newComment,
                timestamp: "Just now"
            };
            setComments([...comments, newCommentObj]);
            setNewComment("");
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="View comments">
                    <MessageSquare className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader className="p-6">
                    <SheetTitle>Chapter Comments</SheetTitle>
                    <SheetDescription>
                        See what other readers are saying about this chapter.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="flex-1 px-6">
                    <div className="space-y-6">
                        {comments.map(comment => (
                            <div key={comment.id} className="flex items-start gap-4">
                                <Avatar className="h-9 w-9 border">
                                    <AvatarImage src={comment.avatar} alt={comment.author} />
                                    <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-sm">{comment.author}</p>
                                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <SheetFooter>
                    <div className="w-full space-y-2">
                        <Textarea 
                            placeholder="Add a comment..." 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                         <Button onClick={handlePostComment} className="w-full">
                            <Send className="mr-2 h-4 w-4" />
                            Post Comment
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
