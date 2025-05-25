import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { code2img, deleteImageFromStorage, img2url } from "@/lib/minIoControls";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import getProject from "@/db/getProjectById";

interface UpdateDiagramBody {
  code?: string;
  name?: string;
}


export async function DELETE(
  request: Request,
  { params }: { params: { id: string, slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await getProject(params.slug);
    // console.log("diagram", diagram?.userId);
    
    if (!project) {
      return NextResponse.json({ error: "project not found" }, { status: 404 });
    }
    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // First delete the image from storage
    await deleteImageFromStorage(params.id);
    
    // Then delete the diagram record from the database
    await prisma.diagram.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting diagram:", error);
    return NextResponse.json(
      { error: "Failed to delete diagram" },
      { status: 500 }
    );
  }
}


export async function PATCH(req: Request, { params }: { params: { id: string,slug: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await getProject(params.slug);
    // console.log("diagram", diagram?.userId);
    
    if (!project) {
      return NextResponse.json({ error: "project not found" }, { status: 404 });
    }
    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await req.json();
    const imgblob = await code2img(body.code);
    await img2url({buffer: imgblob, filename: params.id});
        
    const fileUrl = `/api/projects/${params.slug}/diagrams/${params.id}/image`;
    
    const diagram = await prisma.diagram.update({
      where: { id: params.id },
      data: {
        code: body.code,
        name: body.name,
        imageUrl: fileUrl
      },
    });
    
    return NextResponse.json(diagram);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update diagram" }, { status: 500 });
  }
}

