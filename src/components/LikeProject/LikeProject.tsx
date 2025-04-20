'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
}

export default function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has already liked this project
  useEffect(() => {
    const checkIfLiked = async () => {
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/projects/${postId}/checkLike`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          setIsLiked(data.isLiked);
        }
      } catch (error) {
        console.error('Failed to check like status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkIfLiked();
  }, [postId, session]);

  const handleLike = async () => {
    if (!session?.user) {
      // Redirect to sign in or show sign-in modal
      return;
    }

    // Optimistic UI update
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);

    try {
      const response = await fetch(`/api/projects/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Revert on error
        setIsLiked(!isLiked);
        setLikes(isLiked ? likes : likes - 1);
        throw new Error('Failed to update like');
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  if (isLoading) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm text-white"
        disabled
      >
        <ThumbsUp size={18} className="mr-1" />
        {likes}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleLike}
      variant="ghost"
      size="sm"
      className={`absolute top-2 left-2 backdrop-blur-sm ${isLiked ? 'bg-blue-500/60 text-white' : 'bg-black/40 text-white'}`}
      disabled={!session?.user}
      aria-label={isLiked ? "Unlike" : "Like"}
    >
      <ThumbsUp
        size={18}
        className={`${isLiked ? 'fill-white' : ''} mr-1`}
      />
      {likes}
    </Button>
  );
}