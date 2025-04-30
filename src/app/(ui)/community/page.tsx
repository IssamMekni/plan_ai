import ProjectBtn from "@/components/ProjectCart";
import getPublicProjects from "@/db/getPublicProjects";


const MePage = async () => {
  let projects= await getPublicProjects()
  console.log(projects);  
  return (
    <div>
      <div className="flex flex-col gap-4 container m-auto">
        <h2>Me Page</h2>
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
