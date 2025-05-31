import { prisma } from "@/lib/prisma";
const getPublicUserProjects = async (id: string) => {
  const projects = await prisma.project.findMany({
    where: {
      userId: id,
      isPublic: true,
    },
    include: {
      diagrams: {},
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc' // Order by most recent
    },
  });
  return projects.map((project) => ({
    ...project,
    likes: project?._count.likes || 0,
    diagramsCount: project.diagrams.length,
    commentCount: project?._count.comments || 0,
  }));
};
export default getPublicUserProjects;
