"use client";

import { useState, useEffect } from 'react';
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
import { MessageSquare, Send, ThumbsUp, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { getChapterComments } from '@/lib/github-service';
import type { Comment } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

type CommentsSheetProps = {
    novelId: string;
    chapterId: number;
}

const formatLikes = (likes: number) => {
    if (likes >= 1000000) return `${(likes / 1000000).toFixed(1)}M`;
    if (likes >= 1000) return `${(likes / 1000).toFixed(1)}K`;
    return likes;
}

const CommentEntry = ({ comment }: { comment: Comment }) => (
    <div className="flex items-start gap-4">
        <Avatar className="h-9 w-9 border">
            <AvatarImage src={comment.avatarUrl} alt={comment.name} />
            <AvatarFallback>{comment.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
            <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{comment.name}</p>
                <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{comment.content}</p>
            <div className="flex items-center gap-4 mt-2">
                <Button variant="ghost" size="sm" className="flex items-center gap-1 px-1 h-auto text-xs">
                    <ThumbsUp className="h-3 w-3" />
                    <span>{formatLikes(comment.likes)}</span>
                </Button>
                <Button variant="ghost" size="sm" className="px-1 h-auto text-xs">Reply</Button>
            </div>
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 space-y-4">
                    {comment.replies.map(reply => <CommentEntry key={reply.id} comment={reply} />)}
                </div>
            )}
        </div>
    </div>
);


export function CommentsSheet({ novelId, chapterId }: CommentsSheetProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            getChapterComments(novelId, chapterId)
                .then(fetchedComments => {
                    setComments(fetchedComments);
                })
                .catch(err => console.error("Failed to fetch comments", err))
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, novelId, chapterId]);


    const handlePostComment = () => {
        if (newComment.trim()) {
            const newCommentObj: Comment = {
                id: `${Date.now()}`,
                name: "You",
                avatarUrl: "https://i.imgur.com/JwGSnCv.jpeg",
                content: newComment,
                timestamp: Date.now(),
                likes: 0,
                replies: []
            };
            setComments(prev => [newCommentObj, ...prev]);
            setNewComment("");
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="View comments">
                    <MessageSquare className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col p-0">
                <SheetHeader className="p-6">
                    <SheetTitle>Chapter Comments</SheetTitle>
                    <SheetDescription>
                        See what other readers are saying about this chapter.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="flex-1 px-6">
                     {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : comments.length > 0 ? (
                        <div className="space-y-6">
                            {comments.map(comment => <CommentEntry key={comment.id} comment={comment} />)}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-12">
                            <p>No comments yet. Be the first to share your thoughts!</p>
                        </div>
                    )}
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
