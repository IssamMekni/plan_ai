import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { code2img, img2url } from "@/lib/minIoControls";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Validate session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate slug parameter
    if (!params.slug || typeof params.slug !== 'string') {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    // Find the original project
    const originalProject = await prisma.project.findUnique({
      where: { id: params.slug },
      include: { 
        diagrams: true,
        user: {
          select: { id: true }
        }
      },
    });

    if (!originalProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Authorization check - user can duplicate their own projects or public projects
    const canDuplicate = 
      originalProject.userId === session.user.id || 
      originalProject.isPublic;

    if (!canDuplicate) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Generate unique project name
    const generateUniqueProjectName = async (baseName: string, userId: string): Promise<string> => {
      // First, try the base name with " (copy)"
      let candidateName = `${baseName} (copy)`;
      
      // Check if this name exists for the user
      const existingProject = await prisma.project.findFirst({
        where: {
          name: candidateName,
          userId: userId,
        },
      });

      if (!existingProject) {
        return candidateName;
      }

      // If it exists, try with numbers
      let counter = 1;
      while (true) {
        candidateName = `${baseName} (copy) ${counter}`;
        
        const conflictingProject = await prisma.project.findFirst({
          where: {
            name: candidateName,
            userId: userId,
          },
        });

        if (!conflictingProject) {
          return candidateName;
        }
        
        counter++;
        
        // Safety check to prevent infinite loop
        if (counter > 999) {
          throw new Error("Unable to generate unique project name");
        }
      }
    };

    const uniqueProjectName = await generateUniqueProjectName(originalProject.name, session.user.id);

    // Create the new project with diagrams in a transaction
    const newProject = await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name: uniqueProjectName,
          description: originalProject.description,
          imageUrl: originalProject.imageUrl,
          isPublic: false,
          userId: session.user.id,
          diagrams: {
            create: originalProject.diagrams.map((diagram) => ({
              name: diagram.name,
              code: diagram.code,
            })),
          },
        },
        include: {
          diagrams: true,
        },
      });

      return project;
    });

    // Process diagram images sequentially to avoid overwhelming the system
    const updatedDiagrams = [];
    
    for (const diagram of newProject.diagrams) {
      try {
        // Generate image from code
        const imgBlob = await code2img(diagram.code);
        
        // Upload to storage
        await img2url({ 
          buffer: imgBlob, 
          filename: diagram.id 
        });
        
        // Update diagram with image URL
        const fileUrl = `/api/projects/${newProject.id}/diagrams/${diagram.id}/image`;
        
        const updatedDiagram = await prisma.diagram.update({
          where: { id: diagram.id },
          data: {
            imageUrl: fileUrl,
          },
        });
        
        updatedDiagrams.push(updatedDiagram);
      } catch (imageError) {
        console.error(`Failed to process image for diagram ${diagram.id}:`, imageError);
        // Continue with other diagrams even if one fails
        updatedDiagrams.push(diagram);
      }
    }

    // Return the project with updated diagrams
    const finalProject = {
      ...newProject,
      diagrams: updatedDiagrams,
    };

    return NextResponse.json(finalProject, { status: 201 });

  } catch (error) {
    console.error('Project duplication failed:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "A project with this name already exists" }, 
        { status: 409 }
      );
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Project not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}