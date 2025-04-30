import { prisma } from "@/lib/prisma";

const getPublicProjects = async (page = 1, pageSize = 5) => {
  const skip = (page - 1) * pageSize;
  
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
    orderBy: {
      createdAt: 'desc' // Order by most recent
    },
    take: pageSize,
    skip: skip
  });

  return projects.map(project => ({
    ...project,
    likes: project?._count.likes || 0,
    diagramsCount: project.diagrams.length,
    commentCount: project?._count.comments || 0 // Added commentCount for consistency
  }));
};

// To get just the last 5 public projects:
// const lastFivePublicProjects = await getPublicProjects();

export default getPublicProjects;