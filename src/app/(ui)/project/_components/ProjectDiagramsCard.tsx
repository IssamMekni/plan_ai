// src/components/project/ProjectDiagramsCard.tsx
import { format } from "date-fns";
import { Project } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DiagramTabs from "./DiagramTabs";

interface ProjectDiagramsCardProps {
  project: Project;
  isOwner: boolean;
}

export default function ProjectDiagramsCard({ project, isOwner }: ProjectDiagramsCardProps) {
  return (
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
          <DiagramTabs diagrams={project.diagrams} isOwner={isOwner} />
        ) : (
          <EmptyDiagramsState isOwner={isOwner} />
        )}
      </CardContent>
    </Card>
  );
}

// function DiagramTabs({ diagrams, isOwner }) {
//   const formatDate = (dateString) => {
//     return format(new Date(dateString), "MMM d, yyyy");
//   };

//   const formatTime = (dateString) => {
//     return format(new Date(dateString), "h:mm a");
//   };

//   return (
//     <Tabs defaultValue={diagrams[0].id}>
//       <TabsList className="grid grid-cols-2 md:grid-cols-4">
//         {diagrams.map((diagram) => (
//           <TabsTrigger key={diagram.id} value={diagram.id}>
//             {diagram.name}
//           </TabsTrigger>
//         ))}
//       </TabsList>

//       {diagrams.map((diagram) => (
//         <TabsContent key={diagram.id} value={diagram.id}>
//           <div className="flex flex-col gap-4 mt-4">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-semibold">
//                 {diagram.name}
//               </h3>
//               <div className="text-sm text-muted-foreground">
//                 Last updated: {formatDate(diagram.updatedAt)} at{" "}
//                 {formatTime(diagram.updatedAt)}
//               </div>
//             </div>

//             <div className="border rounded-md overflow-hidden bg-muted">
//               <img
//                 src={diagram.imageUrl}
//                 alt={diagram.name}
//                 width={600}
//                 height={400}
//                 className="w-full h-auto"
//               />
//             </div>

//             {isOwner && (
//               <div className="flex gap-2 justify-end mt-2">
//                 {/* <Button size="sm" variant="outline">
//                   <PenSquare className="h-4 w-4 mr-2" />
//                   Edit
//                 </Button>
//                 <Button size="sm" variant="destructive">
//                   <Trash2 className="h-4 w-4 mr-2" />
//                   Delete
//                 </Button> */}
//               </div>
//             )}
//           </div>
//         </TabsContent>
//       ))}
//     </Tabs>
//   );
// }

function EmptyDiagramsState({ isOwner }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
      <p>No diagrams found for this project.</p>
      {isOwner && (
        <Button className="mt-4">Create your first diagram</Button>
      )}
    </div>
  );
}