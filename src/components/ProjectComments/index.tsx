"use client";
import ProjectComments from "./ProjectComments";
import NextAuthProvider from "@/app/provider/NextAuthProvider";

interface ProjectCommentsProps {
  projectId: string;
  initialComments?: Comment[];
}
export default function layout({ projectId, initialComments}: ProjectCommentsProps) {
    return (
        <NextAuthProvider>
          <ProjectComments projectId={projectId} initialComments={[...initialComments]}  />
        </NextAuthProvider>
    );
  }