import { authOptions } from "@/lib/nextAuth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Delete comment
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    try {
      const commentId = params.id;
      
      // First, verify that the comment belongs to the current user
      const comment = await prisma.projectComment.findUnique({
        where: {
          id: commentId,
        },
        select: {
          userId: true,
        },
      });
      
      if (!comment) {
        return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
      }
      
      // Check if the user is the owner of the comment
      if (comment.userId !== session.user.id) {
        return NextResponse.json(
          { error: 'You can only delete your own comments' }, 
          { status: 403 }
        );
      }
      
      // Delete the comment
      await prisma.projectComment.delete({
        where: {
          id: commentId,
        },
      });
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error deleting comment:', error);
      return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
    }
  }