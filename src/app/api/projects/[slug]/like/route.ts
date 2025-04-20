// app/api/projects/[id]/like/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from "@/lib/nextAuth";

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const projectId = params.slug;
    const userId = session.user.id as string;

    // Check if the like already exists
    const existingLike = await prisma.projectLike.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    if (existingLike) {
      // Unlike if already liked
      await prisma.projectLike.delete({
        where: {
          id: existingLike.id,
        },
      });
      
      return NextResponse.json({ liked: false });
    } else {
      // Like if not already liked
      await prisma.projectLike.create({
        data: {
          userId,
          projectId,
        },
      });
      
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
}

