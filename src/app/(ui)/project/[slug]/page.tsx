import getProject from "@/db/getProjectById";
import { authOptions } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
// import { Project } from "@/types";
import { prisma } from "@/lib/prisma";
import getLikeCount from "@/db/getLikeCount";
import ProjectComments from "@/components/ProjectComments";
import { redirect } from "next/navigation";
import ProjectInfoCard from "../_components/ProjectInfoCard";
import ProjectDiagramsCard from "../_components/ProjectDiagramsCard";

// Updated interface for Next.js 15
interface PageProps {
  params: Promise<{ slug: string }>;
}

// Renamed to avoid conflict with DOM Comment interface
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

type ProjectWithDiagramsAndLikes = {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  imageUrl: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  diagrams: {
    id: string;
    name: string;
    code: string;
    createdAt: Date;
    updatedAt: Date;
    imageUrl: string;
    projectId: string;
  }[];
};

// This is a Server Component
export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const rawProject = await getProject(slug);

  if (!rawProject) {
    redirect("/not-found");
  }

  const project: ProjectWithDiagramsAndLikes = rawProject;

  const session = await getServerSession(authOptions);
  // Check if current user is the project owner
  const isOwner = session?.user?.id === project.userId;

  // If project is private and user is not the owner, redirect to homepage
  if (!project.isPublic && !isOwner) {
    redirect(`/project/${slug}/unauthorized`); // or to a custom "unauthorized" or "not found" page
  }

  // Get the like count for the project
  const likeCount = await getLikeCount(project);
  // Check if current user has liked the project
  let userHasLiked = false;
  if (session?.user?.id) {
    const userLike = await prisma.projectLike.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id as string,
          projectId: project.id,
        },
      },
    });
    userHasLiked = !!userLike;
  }

  // Get comments for initial load
  const comments = await prisma.projectComment.findMany({
    where: {
      projectId: project.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5, // Initial load limited to 5 comments
  });

  // Add like status to comments
  let commentsWithLikeStatus: ProjectCommentWithExtras[] = comments;
  if (session?.user?.id) {
    const userCommentLikes = await prisma.commentLike.findMany({
      where: {
        userId: session.user.id as string,
        commentId: {
          in: comments.map((comment) => comment.id),
        },
      },
    });

    const likedCommentIds = new Set(
      userCommentLikes.map((like) => like.commentId)
    );
    commentsWithLikeStatus = comments.map((comment) => ({
      ...comment,
      isLiked: likedCommentIds.has(comment.id),
    }));
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Project Information */}
        <div className="w-full md:w-1/3">
          <ProjectInfoCard
            project={project}
            isOwner={isOwner}
            likeCount={likeCount}
            slug={slug}
          />
        </div>

        {/* Diagram Display */}
        <div className="w-full md:w-2/3">
          <ProjectDiagramsCard project={project} isOwner={isOwner} />

          {/* Comments Section */}
          <ProjectComments
            projectId={project.id}
            initialComments={commentsWithLikeStatus}
          />
        </div>
      </div>
    </div>
  );
}