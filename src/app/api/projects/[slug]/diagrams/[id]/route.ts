import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { code2imgl, img2url } from "./minIoControls";

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


export async function PATCH(req: Request, { params }: { params: { id: string,slug: string } }) {
  try {
    const body = await req.json();
    const imgblob = await code2imgl(body.code);
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

