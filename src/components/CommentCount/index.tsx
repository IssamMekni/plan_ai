'use client';

import { MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CommentCountProps {
  projectId: string;
  initialCount: number;
  showText?: boolean;
}

export default function CommentCount({ projectId, initialCount = 0, showText = false }: CommentCountProps) {
  return (
    <Link href={`/project/${projectId}#comments`}>
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute top-2 right-2 backdrop-blur-sm bg-black/40 text-white"
        aria-label={`${initialCount} comments`}
      >
        <MessageSquare size={18} className="mr-1" />
        {initialCount}
        {showText && initialCount === 1 && " comment"}
        {showText && initialCount !== 1 && " comments"}
      </Button>
    </Link>
  );
}