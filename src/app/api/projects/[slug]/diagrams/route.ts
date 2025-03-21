// app/api/projects/[id]/diagrams/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


interface CreateDiagramBody {
  name: string;
  code?: string;
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    console.log(params.slug);
    
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