import { NextRequest, NextResponse } from "next/server";
import plantumlEncoder from "plantuml-encoder";

export async function POST(req: NextRequest) {
  try {
    const umlCode = await req.text();
    const encoded = plantumlEncoder.encode(umlCode);
    const plantumlServer = process.env.PLANTUML_SERVER; // Replace with your PlantUML server URL
    const response = await fetch(`${plantumlServer}/png/${encoded}`);
    if (!response.ok) {
      return new NextResponse("Failed to fetch from PlantUML server", {
        status: 500,
      });
    }

    const imageBuffer = await response.arrayBuffer();
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml", // Change to 'image/png' if needed
      },
    });
  } catch (error) {
    return new NextResponse("Server error", { status: 500 });
  }
}
