// @/app/api/user/route.ts
import { authOptions } from "@/lib/nextAuth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log("Session:", session); // Debug log
    
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    if (!session.user) {
      return NextResponse.json({ error: "User not found in session" }, { status: 401 });
    }
    
    // Try different ways to get user ID
    const userId = session.user.id || (session.user as any).sub || (session as any).user?.id;
    
    console.log("User ID:", userId); // Debug log
    
    if (!userId) {
      console.error("No user ID found in session:", session);
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    const { name, description } = await request.json();
    
    console.log("Updating user:", userId, "with data:", { name, description }); // Debug log

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        description,
      },
    });

    console.log("User updated successfully:", updatedUser.id); // Debug log
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes("Record to update not found")) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}