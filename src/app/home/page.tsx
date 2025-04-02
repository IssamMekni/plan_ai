import ProjectBtn from "@/components/ProjectCart";
import exempl from "@/tmp/exemplmyproject.json";
import exempl2 from "@/tmp/exemplComunityProject.json";
import MoreButton from "@/components/Morebtn";
export default function page() {
  return (
    <div>
      <div className="m-2 md:w-2/3 lg:w-1/2 sm:m-auto grid grid-cols-1 flex-col ">
        <h2 className="text-3xl font-bold ">Your Project :</h2>
        <div className="flex flex-col gap-4">
          {exempl.map((project) => (
            <ProjectBtn key={project.name} project={project} />
          ))}
          <MoreButton link="/me" />
        </div>
      </div>
      <div className="m-2 md:w-2/3 lg:w-1/2 sm:m-auto grid grid-cols-1 flex-col pt-10 ">
        <h2 className="text-3xl font-bold">Comunity Project :</h2>
        <div className="grid grid-cols-2 gap-4">
          {exempl2.map((project) => (
            <ProjectBtn key={project.name} project={project} />
          ))}
          <MoreButton link="/" />
        </div>
      </div>
    </div>
  );
}
