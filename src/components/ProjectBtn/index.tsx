import { truncateText } from "@/lib/truncateText";
import { truncateArray } from "@/lib/truncateArray";
import { Workflow } from "lucide-react";
import Link from "next/link";

interface Project {
  imageUrl: string;
  name: string;
  date: string;
  diagramsCount: number;
  description?: string;
  link: string;
  diagrams: { name: string }[];
}

interface ProjectBtnProps {
  project: Project;
}

const ProjectBtn: React.FC<ProjectBtnProps> = ({ project }) => {
  return (
    <Link href={project.link} className="block w-full">
      <div className="border p-4 rounded-lg shadow-lg flex flex-col gap-4 bg-primary-foreground hover:shadow-xl transition-shadow duration-300">
        <h3 className="font-semibold text-xl text-gray-900">{project.name}</h3>
        
        {project.description && (
          <p className="text-gray-500 text-sm">{truncateText(project.description, 100)}</p>
        )}
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-700">Diagrams:</h3>
            <ul className="grid gap-2 list-disc pl-4 text-gray-600">
              {truncateArray(project.diagrams).map((diagram) => (
                <li key={diagram.name} className="bg-primary/10 px-2 py-1 rounded-md text-gray-500 text-sm">
                  {/* {truncateText(diagram.name, 10, 20)} */}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative w-full md:w-2/5 h-40 rounded-lg overflow-hidden shadow-md">
            <img
              src={project.imageUrl}
              alt={project.name}
              className="object-cover w-full h-full"
            />
            <p className="absolute bottom-2 right-2 bg-primary/70 text-white px-3 py-1 flex items-center gap-2 rounded-lg text-lg font-semibold">
              {project.diagramsCount} <Workflow size={20} />
            </p>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm">📅 Date: {project.date}</p>
      </div>
    </Link>
  );
};

export default ProjectBtn;
