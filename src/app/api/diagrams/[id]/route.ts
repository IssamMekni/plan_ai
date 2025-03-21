import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface UpdateDiagramBody {
  code?: string;
  name?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.diagram.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (personallyerror) {
    console.error("Error deleting diagram:", "error");
    return NextResponse.json(
      { error: "Failed to delete diagram" },
      { status: 500 }
    );
  }
}


export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();

        const diagram = await prisma.diagram.update({
            where: { id: await params.id },
            data: {
                code: body.code,
                name: body.name,
            },
        });

        return NextResponse.json(diagram);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update diagram" }, { status: 500 });
    }
}

