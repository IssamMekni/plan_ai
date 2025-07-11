import ProjectBtn from "@/components/ProjectCart";
import getPublicProjects from "@/db/getPublicProjects";

const MePage = async () => {
  let projects = await getPublicProjects();
  console.log(projects);
  
  return (
    <div>
      <div className="flex flex-col gap-4 container m-auto mt-20">
        <h2>Community Page</h2>
        <div className="grid grid-cols-2 gap-4 container m-auto">
          {projects.map((project) => (
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
      </div>
    </div>
  );
};

export default MePage;