'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, ThumbsUp, Trash2, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import CommentLikeButton from "./CommentLikeButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Comment {
  id: string;
  content: string;
  createdAt: Date; // Changed to Date
  updatedAt: Date; // Added
  projectId: string; // Added
  userId: string;
  user: {
    id: string;
    name: string | null; // Changed to string | null
    image: string | null; // Changed to string | null
  };
  _count: {
    likes: number;
  };
  isLiked?: boolean;
}

interface ProjectCommentsProps {
  projectId: string;
  initialComments?: Comment[];
}

export default function ProjectComments({ projectId, initialComments = [] }: ProjectCommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [commentCount, setCommentCount] = useState(initialComments.length);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Fetch comments when component mounts
    fetchComments();
  }, [projectId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
        setCommentCount(data.comments.length);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!session?.user) {
      // Handle unauthenticated user
      alert('Please sign in to comment');
      return;
    }
    
    if (!newComment.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });
      
      if (response.ok) {
        const addedComment = await response.json();
        setComments([addedComment, ...comments]);
        setNewComment('');
        setCommentCount(commentCount + 1);
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove the comment from the UI
        setComments(comments.filter(comment => comment.id !== commentId));
        setCommentCount(commentCount - 1);
      } else {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    } finally {
      setCommentToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const formatDate = (date: Date) => {
    try {
      return format(date, "MMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return date.toISOString(); // Fallback to ISO string
    }
  };

  const handleCommentLike = async (commentId: string, isLiked: boolean) => {
    // Update UI optimistically
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          _count: {
            likes: isLiked ? comment._count.likes - 1 : comment._count.likes + 1
          },
          isLiked: !isLiked
        };
      }
      return comment;
    }));
  };

  const openDeleteDialog = (commentId: string) => {
    setCommentToDelete(commentId);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments ({commentCount})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user?.image || ''} alt={comment.user?.name || 'User'} />
                    <AvatarFallback>{comment.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{comment.user?.name || 'Anonymous'}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
                      </div>
                      <div className="flex items-center">
                        <CommentLikeButton 
                          commentId={comment.id} 
                          initialLikes={comment._count.likes} 
                          initialIsLiked={comment.isLiked || false}
                          onLike={(isLiked) => handleCommentLike(comment.id, isLiked)}
                        />
                        
                        {/* Only show delete option for user's own comments */}
                        {session?.user && session.user.id === comment.userId && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => openDeleteDialog(comment.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete comment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                    <p className="mt-2">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No comments yet. Be the first to comment!
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <form onSubmit={handleSubmitComment} className="w-full">
            <div className="flex gap-3 items-start w-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'User'} />
                <AvatarFallback>{session?.user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={!session?.user || isLoading}
                  className="w-full"
                />
                <div className="flex justify-end mt-2">
                  <Button 
                    type="submit" 
                    disabled={!session?.user || isLoading || !newComment.trim()}
                    size="sm"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isLoading ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardFooter>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => commentToDelete && handleDeleteComment(commentToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}