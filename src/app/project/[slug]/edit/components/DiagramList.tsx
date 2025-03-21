// app/project/[id]/edit/components/DiagramList.tsx
"use client"
import { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";

interface Diagram {
  id: string;
  name: string;
  code: string;
  imageUrl: string;
  updatedAt: string;
}

interface DiagramListProps {
  diagrams: Diagram[];
  activeDiagram: Diagram | null;
  onSelectDiagram: (diagram: Diagram) => void;
  onCreateDiagram: (name: string) => void;
  onDeleteDiagram: (diagramId: string) => void;
  isProcessing: boolean;
}

export default function DiagramList({ 
  diagrams, 
  activeDiagram, 
  onSelectDiagram, 
  onCreateDiagram, 
  onDeleteDiagram,
  isProcessing
}: DiagramListProps) {
  const [newDiagramName, setNewDiagramName] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiagramName.trim()) return;
    
    onCreateDiagram(newDiagramName);
    setNewDiagramName("");
    setIsCreating(false);
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">Diagrams</CardTitle>
        {!isCreating && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsCreating(true)}
            disabled={isProcessing}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isCreating && (
          <form onSubmit={handleCreateSubmit} className="mb-4 flex flex-col gap-2">
            <Input
              placeholder="Diagram name..."
              value={newDiagramName}
              onChange={(e) => setNewDiagramName(e.target.value)}
              disabled={isProcessing}
              autoFocus
            />
            <div className="flex gap-2">
              <Button 
                type="submit" 
                size="sm" 
                className="flex-1"
                disabled={!newDiagramName.trim() || isProcessing}
              >
                Create
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="flex-1" 
                onClick={() => setIsCreating(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {diagrams.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <p>No diagrams yet</p>
              <p className="text-sm">Create one to get started</p>
            </div>
          ) : (
            diagrams.map((diagram) => (
              <div
                key={diagram.id}
                className={`
                  flex items-center justify-between p-2 rounded-md cursor-pointer
                  ${activeDiagram && activeDiagram.id === diagram.id 
                    ? "bg-primary/10 border border-primary/20" 
                    : "hover:bg-accent"}
                `}
                onClick={() => onSelectDiagram(diagram)}
              >
                <div className="truncate">
                  <p className="font-medium truncate">{diagram.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date(diagram.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDiagram(diagram.id);
                  }}
                  disabled={isProcessing}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}