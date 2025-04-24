// app/api/diagrams/[id]/route.ts
import getProject from "@/db/getProjectById";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { deleteImageFromStorage } from "./diagrams/[id]/minIoControls";


interface UpdateDiagramBody {
  code?: string;
  name?: string;
}

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const diagram = await getProject(params.slug)
    
    if (!diagram) {
      return NextResponse.json(
        { error: "Diagram not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(diagram);
  } catch (error) {
    console.error("Error fetching diagram:", error);
    return NextResponse.json(
      { error: "Failed to fetch diagram" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: { slug: string } }) {
  try {
    const body: UpdateDiagramBody = await request.json();
    
    const diagram = await prisma.diagram.update({
      where: { id: params.slug },
      data: {
        code: body.code,
        name: body.name,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(diagram);
  } catch (error) {
    console.error("Error updating diagram:", error);
    return NextResponse.json(
      { error: "Failed to update diagram" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  try {
    // First, get all diagrams associated with this project
    const diagrams = await prisma.diagram.findMany({
      where: { projectId: params.slug }
    });
    
    // Delete each diagram's image from storage
    const deleteImagePromises = diagrams.map(diagram => 
      deleteImageFromStorage(diagram.id)
    );
    
    // Wait for all image deletions to complete
    await Promise.all(deleteImagePromises);
    
    // Now delete the project from the database
    // This will cascade delete the diagrams thanks to the onDelete: Cascade relation
    await prisma.project.delete({
      where: { id: params.slug }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}