import { prisma } from "@/lib/prisma";
const getUserProjects = async (id:string) => {
    const projects=await prisma.project.findMany({
        where:{
            userId:id
        },
        include:{
            diagrams:{}
    }

})
    return projects
}
export default getUserProjects;