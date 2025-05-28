import MoreButton from "@/components/Morebtn";
import getUserProjects from "./db/getUserProjects";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { redirect } from "next/navigation";
import ProjectCart from "@/components/ProjectCart";
import getPublicProjects from "./db/getPublicProjects";
export default async function page() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    redirect("/signin");
  }
  const UserProjects = await getUserProjects(session.user.id, 1, 2);
  const PublicProjects = await getPublicProjects(1, 3);
  return (
    <div>
      <div className="m-2 md:w-2/3 lg:w-1/2 sm:m-auto grid grid-cols-1 flex-col ">
        <h2 className="text-3xl font-bold ">Your Project :</h2>
        <div className="flex flex-col gap-4">
          {UserProjects.map((project) => (
            <ProjectCart
              key={project.name}
              project={{ 
                ...project, 
                link: `/project/${project.id}`,
                commentCount: project._count.comments,
                createdAt: project.createdAt.toISOString(),
                description: project.description || undefined
              }}            />
            // <div>prj.name</div>
          ))}
          <MoreButton link="/me" />
        </div>
      </div>
      <div className="m-2 md:w-2/3 lg:w-1/2 sm:m-auto grid grid-cols-1 flex-col pt-10 ">
        <h2 className="text-3xl font-bold">Comunity Project :</h2>
        <div className="grid grid-cols-2 gap-4">
          {PublicProjects.map((project) => (
            <ProjectCart
              key={project.name}
              project={{ 
                ...project, 
                link: `/project/${project.id}`,
                commentCount: project._count.comments,
                createdAt: project.createdAt.toISOString(),
                description: project.description || undefined
              }}            />
          ))}
          <MoreButton link="/community" />
        </div>
      </div>
    </div>
  );
}
