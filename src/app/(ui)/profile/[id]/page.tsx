//app/(ui)/profile/[id]/page.tsx
import ProjectBtn from "@/components/ProjectCart";
import { authOptions } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, FolderOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import getPublicUserProjects from "@/db/getPublicUserProjects";

interface UserProfilePageProps {
  params:Promise<{ id: string }>
}
//  Promise<{ id: string }>
const UserProfilePage = async ({ params }: UserProfilePageProps) => {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  // Get the user being viewed
  const user = await prisma.user.findUnique({
    where: {
      id: id
    },
  });
  const userProject= await getPublicUserProjects(id)
  
  if (!user) {
    notFound();
  }

  // Check if viewing own profile
  const isOwnProfile = session?.user?.id === user.id;

  // If it's their own profile, redirect to /me
  if (isOwnProfile) {
    redirect("/me");
  }

  // Format join date
  const joinDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long'
  }).format(new Date(user.createdAt));

  return (
    <div className="p-10">
      <div className="flex flex-col gap-6 container m-auto py-8">
        {/* Profile Header */}
        <div className="flex flex-col gap-4 p-6 border rounded-lg bg-card">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.image || ""} alt={user.name || "User"} />
              <AvatarFallback className="text-lg">
                {user.name?.substring(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user.name || "Anonymous User"}</h1>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <CalendarDays className="w-4 h-4" />
                <span className="text-sm">Joined {joinDate}</span>
              </div>
            </div>
          </div>
          
          {/* Description section */}
          {user.description && user.description.trim() && user.description !== " " ? (
            <div className="mt-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">About</h3>
              <p className="text-sm leading-relaxed">{user.description}</p>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground italic">
                This user hasn't added a description yet.
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{userProject.length}</span>
              <span className="text-sm text-muted-foreground">
                Public Project{userProject.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Public Projects</h2>
            <Badge variant="secondary">{userProject.length}</Badge>
          </div>
        </div>
        
        {userProject.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 container m-auto">
            {userProject.map((project) => (
              <ProjectBtn
                key={project.id}
                project={{
                  ...project,
                  link: `/project/${project.id}`,
                  commentCount: project._count.comments,
                  createdAt: project.createdAt.toISOString(),
                  description: project.description || undefined
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No Public Projects
            </h3>
            <p className="text-sm text-muted-foreground">
              {user.name || "This user"} hasn't shared any public projects yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;