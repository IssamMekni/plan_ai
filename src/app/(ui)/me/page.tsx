import ProjectBtn from "@/components/ProjectCart";
import getUserProjects from "@/db/getUserProjects";
import { authOptions } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ProjectDialog from "./ProjectDialog";
import EditProfileDialog from "./EditProfileDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { prisma } from "@/lib/prisma";

const MePage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");
  
  const projects = await getUserProjects(session.user.id);
  
  // Get full user data
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    }
  });
  
  if (!user) redirect("/signin");

  return (
    <div className="p-10">
      <div className="flex flex-col gap-6 container m-auto py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <EditProfileDialog user={user} />
        </div>
        
        <div className="flex items-center gap-4 p-4 border rounded-lg">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
            <AvatarFallback>{user.name?.substring(0, 2) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-medium">{user.name || "Anonymous User"}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-8">
          <h2 className="text-2xl font-bold">My Projects</h2>
          <ProjectDialog />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 container m-auto">
          {projects.map((project) => (
            <ProjectBtn
              key={project.id}
              project={{ ...project, link: `/project/${project.id}` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MePage;