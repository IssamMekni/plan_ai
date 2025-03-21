import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface UpdateDiagramBody {
  code?: string;
  name?: string;
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
      await prisma.diagram.delete({
        where: { id: params.id }
      });
  
      return NextResponse.json({ success: true });
    } catch ( personallyerror) {
      console.error("Error deleting diagram:", "error");
      return NextResponse.json(
        { error: "Failed to delete diagram" },
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