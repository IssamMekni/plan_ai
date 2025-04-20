// app/api/projects/[id]/checkLike/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/nextAuth';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ isLiked: false });
  }

  try {
    const projectId = params.slug;
    const userId = session.user.id as string;

    // Check if the like exists
    const existingLike = await prisma.projectLike.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    return NextResponse.json({ isLiked: !!existingLike });
  } catch (error) {
    console.error('Error checking like status:', error);
    return NextResponse.json({ error: 'Failed to check like status' }, { status: 500 });
  }
}