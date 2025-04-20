"use client";
import LikePrject from "./LikeProject";
import NextAuthProvider from "@/app/provider/NextAuthProvider";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
}
export default function layout({ postId, initialLikes }: LikeButtonProps) {
    return (
        <NextAuthProvider>
          <LikePrject postId={postId} initialLikes={initialLikes} />
        </NextAuthProvider>
    );
  }