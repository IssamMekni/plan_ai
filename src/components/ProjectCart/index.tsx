// components/ProjectCart.tsx
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
import LikeButton from "../LikeProject";
import CommentCount from "../CommentCount";

interface Project {
  id: string;
  imageUrl: string;
  name: string;
  createdAt: string | Date;
  diagramsCount: number;
  description?: string;
  link: string;
  diagrams: { name: string }[];
  likes: number;
  commentCount: number;
}

interface ProjectCartProps {
  project: Project;
}

const ProjectCart: React.FC<ProjectCartProps> = ({ project }) => {
  const formatDate = (dateString: string | Date): string => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return format(date, "MMM d, yyyy");
  };

  const formatTime = (dateString: string | Date): string => {
    return format(new Date(dateString), "h:mm a");
  };

  return (
    <div className="border p-4 rounded-lg shadow-lg flex flex-col gap-4 bg-primary-foreground hover:shadow-xl transition-shadow duration-300">
      <h3 className="font-semibold text-xl text-white">{project.name}</h3>
      <p className="text-gray-500 text-sm">
        {project.description ? (
          <>{truncateText(project.description, 100)}</>
        ) : (
          <br />
        )}
      </p>
      
      <div className="flex flex-col gap-6">
        <div className="relative w-full h-40 rounded-lg shadow-md">
          {/* Like Button */}
          <LikeButton postId={project.id} initialLikes={project.likes} />
          
          {/* Comment Count */}
          <CommentCount projectId={project.id} initialCount={project.commentCount} />
          
          <img
            src={project.imageUrl}
            alt={project.name}
            className="object-cover w-full h-full rounded-lg"
          />
          
          <div className="">
            {(project.diagrams.length > 0) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="secondary"
                    className="absolute bottom-2 right-2 bg-primary/70 text-white px-3 py-1 flex items-center gap-2 rounded-lg text-lg font-semibold hover:bg-primary/80"
                  >
                    {project.diagramsCount} <Workflow size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background/60 backdrop-blur-sm">
                  {project.diagrams.map((diagram, index) => (
                    <DropdownMenuItem key={`${diagram.name}-${index}`}>
                      {diagram.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-gray-500 text-sm">
          📅 Date: {formatDate(project.createdAt)} at {formatTime(project.createdAt)}
        </p>
        <Link href={project.link}>
          <Button className="font-bold text-lg flex items-center gap-2">
            Go <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProjectCart;