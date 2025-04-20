// app/api/projects/[id]/comments/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/nextAuth";
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Get all comments for a project
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  const projectId = params.slug;
  const userId = session?.user?.id;

  try {
    const comments = await prisma.projectComment.findMany({
      where: {
        projectId,
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
    });

    // If user is logged in, check which comments they've liked
    let commentsWithLikeStatus = comments;

    if (userId) {
      const userLikes = await prisma.commentLike.findMany({
        where: {
          userId: userId as string,
          commentId: {
            in: comments.map((comment) => comment.id),
          },
        },
      });

      const likedCommentIds = new Set(userLikes.map((like) => like.commentId));

      commentsWithLikeStatus = comments.map((comment) => ({
        ...comment,
        isLiked: likedCommentIds.has(comment.id),
      }));
    }

    return NextResponse.json({ comments: commentsWithLikeStatus });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// Post a new comment
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const projectId = params.slug;
    const userId = session.user.id as string;
    const { content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    const comment = await prisma.projectComment.create({
      data: {
        content,
        projectId,
        userId,
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
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

