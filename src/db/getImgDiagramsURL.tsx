import { prisma } from "@/lib/prisma";
const getImgDiagramsURL =  async (projectId: string)=>(await prisma.diagram.findMany({
    where: {
      projectId
    },
  }));
  export default getImgDiagramsURL