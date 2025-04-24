// src/app/project/[slug]/page.tsx
import Link from "next/link";
import getProject from "@/db/getProjectById";
import { authOptions } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Trash2,
  Settings,
  MessageSquare,
} from "lucide-react";
import { handleSubmit } from "@/db/action/updateProject";
import LikeButton from "@/components/LikeProject";
import ProjectComments from "@/components/ProjectComments";
import { prisma } from "@/lib/prisma";
import getLikeCount from "@/db/getLikeCount";
import { DeleteProjectButton } from "./Delete";

// This is a Server Component
export default async function ProjectPage({ params }:{params:{slug:string}}) {
  // In a real app, you would fetch this data from your API or database
  // For example: const project = await getProjectById(params.id);

  // Sample data with more diagrams
  const { slug } = await params;
  const project: Project = await getProject(slug);
  const session = await getServerSession(authOptions);
  
  // Get the like count for the project
  const likeCount = getLikeCount(project)
  
  // Check if current user has liked the project
  let userHasLiked = false;
  if (session?.user?.id) {
    const userLike = await prisma.projectLike.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id as string,
          projectId: project.id,
        },
      },
    });
    userHasLiked = !!userLike;
  }
  
  // Get comments for initial load
  const comments = await prisma.projectComment.findMany({
    where: {
      projectId: project.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5, // Initial load limited to 5 comments
  });
  
  // Add like status to comments
  let commentsWithLikeStatus = comments;
  if (session?.user?.id) {
    const userCommentLikes = await prisma.commentLike.findMany({
      where: {
        userId: session.user.id as string,
        commentId: {
          in: comments.map(comment => comment.id),
        },
      },
    });
    
    const likedCommentIds = new Set(userCommentLikes.map(like => like.commentId));
    
    commentsWithLikeStatus = comments.map(comment => ({
      ...comment,
      isLiked: likedCommentIds.has(comment.id),
    }));
  }

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const formatTime = (dateString) => {
    return format(new Date(dateString), "h:mm a");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6 ">
        {/* Project Information */}
        <div className="w-full md:w-1/3  ">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-start ">
                <CardTitle className="text-2xl font-bold justify-self-start w-full">
                  {project.name || "Untitled Project"}
                </CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="p-1 h-fit justify-self-end mr-1"
                    >
                      <Settings />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-background">
                    <DialogHeader>
                      <DialogTitle>Edit project </DialogTitle>
                      <DialogDescription>
                        Make changes to your project here. Click save when
                        you're done.
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
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="username" className="text-right">
                            Username
                          </Label>
                          <Textarea
                            id="project-description"
                            name="project-description"
                            defaultValue={project?.description}
                            className="col-span-3"
                          />
                          <Label htmlFor="username" className="text-right">
                            Username
                          </Label>
                          <RadioGroup
                            defaultValue={
                              project.isPublic ? "true" : "false"
                            }
                            name="project-visibility"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="false" id="r1" />
                              <Label htmlFor="r1">Privet</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="true" id="r2" />
                              <Label htmlFor="r2">Public</Label>
                            </div>
                          </RadioGroup>
                          <input type="hidden" name="project-id" value={project.id} />
                        </div>
                      </div>
                      <DialogFooter>
                      <DialogClose type="submit" className="text-background bg-primary hover:bg-primary/90  p-2 rounded-md">
                        Save changes
                      </DialogClose>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <Badge
                  variant={project.isPublic ? "default" : "outline"}
                  className="justify-self-end py-1"
                >
                  {project.isPublic ? (
                    <Globe className="h-4 w-4 mr-1" />
                  ) : (
                    <Lock className="h-4 w-4 mr-1" />
                  )}
                  {project.isPublic ? "Public" : "Private"}
                </Badge>
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
              <div className="flex w-full gap-2">
                <Link href={"/project/" + slug+ "/edit"} className="flex-1">
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
              <DeleteProjectButton projectId={project.id} />
            </CardFooter>
          </Card>
        </div>

        {/* Diagram Display */}
        <div className="w-full md:w-2/3">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Diagrams ({project.diagrams.length})</CardTitle>
                <div className="flex gap-2">
                  {/* <Button size="sm" variant="outline">
                    Sort
                  </Button>
                  <Button size="sm">Add Diagram</Button> */}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {project.diagrams.length > 0 ? (
                <Tabs defaultValue={project.diagrams[0].id}>
                  <TabsList className="grid grid-cols-2 md:grid-cols-4">
                    {project.diagrams.map((diagram) => (
                      <TabsTrigger key={diagram.id} value={diagram.id}>
                        {diagram.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {project.diagrams.map((diagram) => (
                    <TabsContent key={diagram.id} value={diagram.id}>
                      <div className="flex flex-col gap-4 mt-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">
                            {diagram.name}
                          </h3>
                          <div className="text-sm text-muted-foreground">
                            Last updated: {formatDate(diagram.updatedAt)} at{" "}
                            {formatTime(diagram.updatedAt)}
                          </div>
                        </div>

                        <div className="border rounded-md overflow-hidden bg-muted">
                          <img
                            src={diagram.imageUrl}
                            alt={diagram.name}
                            width={600}
                            height={400}
                            className="w-full h-auto"
                          />
                        </div>

                        <div className="flex gap-2 justify-end mt-2">
                          {/* <Button size="sm" variant="outline">
                            <PenSquare className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button> */}
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <p>No diagrams found for this project.</p>
                  <Button className="mt-4">Create your first diagram</Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Comments Section */}
          <ProjectComments 
            projectId={project.id}
            initialComments={commentsWithLikeStatus}
          />
        </div>
      </div>
    </div>
  );
}