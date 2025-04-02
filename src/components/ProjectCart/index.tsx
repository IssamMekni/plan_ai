// components/ProjectBtn.tsx
import { truncateText } from "@/lib/truncateText";
import { ArrowRight, Workflow } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Project {
  imageUrl: string;
  name: string;
  createdAt: string;
  diagramsCount: number;
  description?: string;
  link: string;
  diagrams: { name: string }[];
}

interface ProjectBtnProps {
  project: Project;
}

const ProjectBtn: React.FC<ProjectBtnProps> = ({ project }) => {
  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const formatTime = (dateString) => {
    return format(new Date(dateString), "h:mm a");
  };
  return (
    <div className="border p-4 rounded-lg shadow-lg flex flex-col gap-4 bg-primary-foreground hover:shadow-xl transition-shadow duration-300">
      <h3 className="font-semibold text-xl text-white">{project.name}</h3>

      <p className="text-gray-500 text-sm">
        {project.description ? <>{truncateText(project.description, 100)}</>:<br/>}
      </p>

      <div className="flex flex-col gap-6">
        <div className="relative w-full h-40 rounded-lg shadow-md">
          <img
            src={project.imageUrl}
            alt={project.name}
            className="object-cover w-full h-full"
          />
          <div className="">
            {project.diagrams.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger className="absolute bottom-2 right-2 bg-primary/70 text-white px-3 py-1 flex items-center gap-2 rounded-lg text-lg font-semibold">
                  {project.diagramsCount} <Workflow size={20} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background/60 backdrop-blur-sm">
                  {project.diagrams.map((diagram) => (
                    <DropdownMenuItem key={diagram.name}>
                      {diagram.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <p className="text-gray-500 text-sm">
          📅 Date:
          {formatDate(project.createdAt)} at {formatTime(project.createdAt)}
        </p>
        <Link href={project.link}>
          <Button className="font-bold text-lg">
            go <ArrowRight />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProjectBtn;
