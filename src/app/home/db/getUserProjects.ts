import { prisma } from "@/lib/prisma";

const getUserProjects = async (id: string, page = 1, pageSize = 5) => {
  const skip = (page - 1) * pageSize;
  
  const projects = await prisma.project.findMany({
    where: {
      userId: id
    },
    include: {
      diagrams: {
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc' // Assuming you have a createdAt field to get the latest projects
    },
    take: pageSize,
    skip: skip
  });

  return projects.map(project => ({
    ...project,
    likes: project?._count.likes || 0,
    diagramsCount: project.diagrams.length,
    commentCount: project?._count.comments || 0
  }));
};

// To get just the last 5 projects, call the function like this:
// const lastFiveProjects = await getUserProjects(userId, 1, 5);

export default getUserProjects;