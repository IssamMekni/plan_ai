"use client";
import ProjectComments from "./ProjectComments";
import NextAuthProvider from "@/app/provider/NextAuthProvider";

// Define the correct comment type to match what's being passed from the server component
type ProjectCommentWithExtras = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  projectId: string;
  userId: string;
  content: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  _count: {
    likes: number;
  };
  isLiked?: boolean;
};

interface ProjectCommentsProps {
  projectId: string;
  initialComments?: ProjectCommentWithExtras[];
}

export default function layout({ projectId, initialComments = [] }: ProjectCommentsProps) {
  return (
    <NextAuthProvider>
      <ProjectComments projectId={projectId} initialComments={initialComments} />
    </NextAuthProvider>
  );
}