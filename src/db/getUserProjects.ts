import { prisma } from "@/lib/prisma";
const getUserProjects = async (id:string) => {
    const projects=await prisma.project.findMany({
        where:{
            userId:id
        },
        include:{
            diagrams:{

            },
            _count: {
                select: {
                  likes: true,
                  comments: true,
                },
              },
    }

})
return projects.map(project => ({
    ...project,
    likes: project?._count.likes||0,
    diagramsCount: project.diagrams.length,
    commentCount:project?._count.comments||0
  }));
}
export default getUserProjects;