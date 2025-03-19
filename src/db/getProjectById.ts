import { prisma } from "@/lib/prisma";
const getProject = async (idProject:string) => {
    const projects=await prisma.project.findUnique({
        where:{
            id:idProject
        },
        include:{
            diagrams:{
        }
    }
})
    return projects
}
export default getProject;