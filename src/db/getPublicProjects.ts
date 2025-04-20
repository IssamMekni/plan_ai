import { prisma } from "@/lib/prisma";
const getPublicProjects = async () => {
  const projects = await prisma.project.findMany({
    where: {
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
  });
  return projects.map(project => ({
    ...project,
    likes: project?._count.likes||0,
    diagramsCount: project.diagrams.length,
  }));
};
export default getPublicProjects;
