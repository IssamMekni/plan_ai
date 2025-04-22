import { prisma } from "@/lib/prisma";

  const getLikeCount =  async (project: { id: string; })=>(await prisma.projectLike.count({
    where: {
      projectId: project.id,
    },
  }));
  export default getLikeCount