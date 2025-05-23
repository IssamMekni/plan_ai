import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { projectId, userId } = await req.json();
  const originalProject = await prisma.project.findUnique({
    where: { id: projectId },
    include: { diagrams: true },
  });

  if (!originalProject) {
    return NextResponse.json({ message: 'المشروع غير موجود' }, { status: 404 });
  }

  const newProject = await prisma.project.create({
    data: {
      name: `${originalProject.name}(copy)`,
      description: originalProject.description,
      imageUrl: originalProject.imageUrl,
      isPublic: false,
      userId,
      diagrams: {
        create: originalProject.diagrams.map((d) => ({
          name: d.name,
          code: d.code,
        })),
      },
    },
  });

  return NextResponse.json(newProject);
}