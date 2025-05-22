// app/api/projects/[id]/diagrams/route.ts
import getProject from "@/db/getProjectById";
import { authOptions } from "@/lib/nextAuth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


interface CreateDiagramBody {
  name: string;
  code?: string;
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
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
    
    const body: CreateDiagramBody = await request.json();
    
    const diagram = await prisma.diagram.create({
      data: {
        name: body.name,
        code: body.code || "@startuml\n\n@enduml",
        projectId: params.slug
      }
    });

    return NextResponse.json(diagram);
  } catch (error) {
    console.error("Error creating diagram:", error);
    return NextResponse.json(
      { error: "Failed to create diagram" },
      { status: 500 }
    );
  }
}