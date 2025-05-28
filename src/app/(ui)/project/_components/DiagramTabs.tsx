"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
// import ZoomableSVGFromURL from "./MyZoomableSVG";
import SVGViewer from "./SVGViewer";

// Define the diagram type
type Diagram = {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string;
  projectId: string;
};

// Define the component props interface
interface DiagramTabsProps {
  diagrams: Diagram[];
  isOwner: boolean;
}

function DiagramTabs({ diagrams, isOwner }: DiagramTabsProps) {
  const formatDate = (dateString: Date | string): string => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const formatTime = (dateString: Date | string): string => {
    return format(new Date(dateString), "h:mm a");
  };

  return (
    <Tabs defaultValue={diagrams[0]?.id}>
      <TabsList className="grid grid-cols-2 md:grid-cols-4">
        {diagrams.map((diagram) => (
          <TabsTrigger key={diagram.id} value={diagram.id}>
            {diagram.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {diagrams.map((diagram) => (
        <TabsContent key={diagram.id} value={diagram.id}>
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{diagram.name}</h3>
              <div className="text-sm text-muted-foreground">
                Last updated: {formatDate(diagram.updatedAt)} at{" "}
                {formatTime(diagram.updatedAt)}
              </div>
            </div>
            <div className="border rounded-md overflow-hidden bg-muted">
              <img
                src={diagram.imageUrl}
                alt={diagram.name}
                className="w-full h-auto"
              />
            </div>
            {isOwner && (
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
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default DiagramTabs;
