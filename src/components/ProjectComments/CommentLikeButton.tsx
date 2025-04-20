'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { ThumbsUp } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CommentLikeButtonProps {
  commentId: string;
  initialLikes: number;
  initialIsLiked: boolean;
  onLike: (isLiked: boolean) => void;
}

export default function CommentLikeButton({ 
  commentId, 
  initialLikes, 
  initialIsLiked,
  onLike
}: CommentLikeButtonProps) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  const handleLike = async () => {
    if (!session?.user) {
      // Could redirect to sign in or show sign-in modal
      return;
    }

    // Optimistic UI update
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikes(newIsLiked ? likes + 1 : likes - 1);
    onLike(isLiked);

    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Revert on error
        setIsLiked(!newIsLiked);
        setLikes(newIsLiked ? likes : likes + 1);
        onLike(!isLiked);
        throw new Error('Failed to update like');
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  return (
    <Button
      onClick={handleLike}
      variant="ghost"
      size="sm"
      className={`${isLiked ? 'text-blue-500' : 'text-muted-foreground'}`}
      disabled={!session?.user}
    >
      <ThumbsUp
        size={16}
        className={`${isLiked ? 'fill-blue-500' : ''} mr-1`}
      />
      {likes > 0 && <span>{likes}</span>}
    </Button>
  );
}