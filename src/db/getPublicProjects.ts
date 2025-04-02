import { prisma } from "@/lib/prisma";
const getPublicProjects = async () => {
    const projects=await prisma.project.findMany({
        where:{
            isPublic:true
        },
        include:{
            diagrams:{
                
            }
    }

})
    return projects
}
export default getPublicProjects;