import { truncateText } from '@/lib/truncateText';
import { Workflow } from 'lucide-react';
import Link from 'next/link';
// Define the Project interface
interface Project {
  imageUrl: string;
  name: string;
  date: string;
  diagramsCount: number;
  description?: string;
  link : string;
}

// Existing props interface using the Project type
interface ProjectBtnProps {
  project: Project;
}

// The ProjectBtn component
const ProjectBtn: React.FC<ProjectBtnProps> = ({ project }) => {
  return (
  <Link href={project.link} >
    <div className="border p-4 rounded-md shadow-md flex flex-col items-center bg-primary-foreground">
      <h3 className="font-semibold self-start">{project.name}</h3>
      <div className=" w-full ">
          <p className="text-gray-500 "> {project.description&&truncateText(project.description)}</p>
        <div className="rounded-lg mb-2  relative overflow-hidden justify-self-center w-full h-60">
          <img src={project.imageUrl} alt={project.name} className="object-cover w-full" />
          <p className="text-white absolute bottom-4 right-4 px-2 flex align-middle justify-center gap-4 font-bold text-2xl  rounded-lg bg-primary/50 "> {project.diagramsCount} <Workflow className='relative -bottom-1'/></p>
        </div>
      </div>
      <div className='grid grid-cols-6 items-center gap-4'>
      <p className="text-gray-500 col-span-4">Date: {project.date}</p>
      </div>
    </div>
  </Link>
  );
};

export default ProjectBtn;
