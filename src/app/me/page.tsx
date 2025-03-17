import ProjectBtn from "@/components/ProjectBtn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { handleSubmit } from "@/db/action/creatProject";
import getUserProjects from "@/db/getUserProjects";
import { authOptions } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const MePage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");
  const projects = await getUserProjects(session.user.id);
  return (
    <div>
      <div className="flex flex-col gap-4 container m-auto">
        <h2>Me Page</h2>
        <div className="w-1/2 self-center ">
          <form action={handleSubmit}>
            <div className="flex flex-col gap-4">
              <Label>Name</Label>
              <Input type="text" name="project-name" />
              <Label>discrition</Label>
              <Textarea name="descripion"></Textarea>
              <Button>Add</Button>
            </div>
          </form>
        </div>
        <div className="grid grid-cols-2 gap-4 container m-auto">
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
