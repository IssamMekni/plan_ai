// src/components/project/ProjectInfoCard.tsx
import Link from "next/link";
import { format } from "date-fns";
import { Project } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Globe,
  Lock,
  Calendar,
  Clock,
  PenSquare,
  Share2,
  Settings,
} from "lucide-react";
import { handleSubmit } from "@/db/action/updateProject";
import LikeButton from "@/components/LikeProject";
import { DeleteProjectButton } from "./Delete";
import DownloadButton from "./DownloadButton";
import CopyButton from "./CopyButton";
import { get } from "http";
import getImgDiagramsURL from "@/db/getImgDiagramsURL";
// import { DeleteProjectButton } from "../project/[slug]/Delete";

interface ProjectInfoCardProps {
  project: Project;
  isOwner: boolean;
  likeCount: number;
  slug: string;
}

export default function ProjectInfoCard({
  project,
  isOwner,
  likeCount,
  slug,
}: ProjectInfoCardProps) {
  const formatDate = (dateString: Date | string): string => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start">
          <CardTitle className="text-2xl font-bold justify-self-start w-full">
            {project.name || "Untitled Project"}
          </CardTitle>
          {isOwner && <ProjectEditDialog project={project} />}
          <ProjectVisibilityBadge isPublic={project.isPublic} />
        </div>
        {project.description && (
          <CardDescription>{project.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <img
              src={project.imageUrl}
              alt={project.name || "Project image"}
              width={600}
              height={400}
              className="rounded-md object-cover w-full h-48"
            />
            {/* Add the like button to the top left of the image */}
            <LikeButton postId={project.id} initialLikes={likeCount} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Created: {formatDate(project.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>Updated: {formatDate(project.updatedAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {isOwner ? (
          <>
            <div className="grid grid-cols-2 w-full gap-2">
              <Link href={"/project/" + slug + "/edit"} className="flex-1">
                <Button className="w-full" variant="default">
                  <PenSquare className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Button className="flex-1" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            <div className="w-full text-center grid grid-cols-2 gap-2">
              <DeleteProjectButton projectId={project.id} />
              <DownloadButton projectId={project.id} />
              <CopyButton projectId={project.id} userId={project.userId} />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 w-full gap-2">
              <Button className="w-full" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <DownloadButton projectId={project.id} />
              <CopyButton projectId={project.id} userId={project.userId} />
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

// Sub-components for ProjectInfoCard

function ProjectVisibilityBadge({ isPublic }: { isPublic: boolean }) {
  return (
    <Badge
      variant={isPublic ? "default" : "outline"}
      className="justify-self-end py-1"
    >
      {isPublic ? (
        <Globe className="h-4 w-4 mr-1" />
      ) : (
        <Lock className="h-4 w-4 mr-1" />
      )}
      {isPublic ? "Public" : "Private"}
    </Badge>
  );
}

async function ProjectEditDialog({ project }: { project: Project }) {
  const imgURLs = (await getImgDiagramsURL(project.id)).map((e) => e.imageUrl);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="p-1 h-fit justify-self-end mr-1">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background">
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
          <DialogDescription>
            Make changes to your project here. Click save when you're done.
            {/* {JSON.stringify(imgURLs)} */}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="project-name"
                name="project-name"
                defaultValue={project.name || "Untitled Project"}
                className="col-span-3"
              />
            </div>
            <div className="">
              <Label htmlFor="project-description" className="text-right">
                description
              </Label>
              <Textarea
                id="project-description"
                name="project-description"
                defaultValue={project?.description || ""}
                className="col-span-3"
              />
              <Label htmlFor="project-visibility" className="text-right">
                visibility
              </Label>
              <RadioGroup
                defaultValue={project.isPublic ? "true" : "false"}
                name="project-visibility"
                className="col-span-3 flex"
              >
                <div className="flex items-center space-x-2 ">
                  <RadioGroupItem value="false" id="r1" />
                  <Label htmlFor="r1">Private</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="r2" />
                  <Label htmlFor="r2">Public</Label>
                </div>
              </RadioGroup>
              <input type="hidden" name="project-id" value={project.id} />
            </div>
            <div>
              <Label htmlFor="project-image" className="text-right">
                project image
              </Label>
              <RadioGroup
                defaultValue={project.imageUrl || imgURLs[0]}
                name="project-image"
                className="flex flex-wrap"
              >
                {imgURLs.map((url, index) => (
                  <div className="flex  items-center space-x-2">
                    <RadioGroupItem value={url} id={`img-${index}`} />
                    <label htmlFor={`img-${index}`}>
                      <img src={url} alt="" className="h-32 w-32 mr-2" />
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <DialogClose
              type="submit"
              className="text-background bg-primary hover:bg-primary/90 p-2 rounded-md"
            >
              Save changes
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
