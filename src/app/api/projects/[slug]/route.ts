// app/api/diagrams/[id]/route.ts
import getProject from "@/db/getProjectById";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { deleteImageFromStorage } from "../../../../lib/minIoControls";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";

interface UpdateDiagramBody {
  code?: string;
  name?: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { slug } = await params;

    const project = await getProject(slug);
    // console.log("diagram", diagram?.userId);

    if (!project) {
      return NextResponse.json({ error: "project not found" }, { status: 404 });
    }
    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { slug } = await params;

    const project = await getProject(slug);
    // console.log("diagram", diagram?.userId);

    if (!project) {
      return NextResponse.json({ error: "project not found" }, { status: 404 });
    }
    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // console.log("params", "any");

    const body: UpdateDiagramBody = await request.json();

    const diagram = await prisma.diagram.update({
      where: { id: slug },
      data: {
        code: body.code,
        name: body.name,
        updatedAt: new Date(),
      },
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { slug } = await params;

    const project = await getProject(slug);
    // console.log("diagram", diagram?.userId);

    if (!project) {
      return NextResponse.json({ error: "project not found" }, { status: 404 });
    }
    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // First, get all diagrams associated with this project
    const diagrams = await prisma.diagram.findMany({
      where: { projectId: slug },
    });

    // Delete each diagram's image from storage
    const deleteImagePromises = diagrams.map((diagram) =>
      deleteImageFromStorage(diagram.id)
    );

    // Wait for all image deletions to complete
    await Promise.all(deleteImagePromises);

    // Now delete the project from the database
    // This will cascade delete the diagrams thanks to the onDelete: Cascade relation
    await prisma.project.delete({
      where: { id: slug },
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
