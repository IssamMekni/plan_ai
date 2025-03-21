// app/project/[id]/edit/components/DiagramEditor.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, RefreshCw } from "lucide-react";
// import Image from "next/image";

interface Diagram {
  id: string;
  name: string;
  code: string;
  imageUrl: string;
  updatedAt: string;
}

interface DiagramEditorProps {
  diagram: Diagram;
  code: string;
  onCodeChange: (newCode: string) => void;
  onSave: () => void;
  isProcessing: boolean;
}

export default function DiagramEditor({ 
  diagram, 
  code, 
  onCodeChange, 
  onSave,
  isProcessing
}: DiagramEditorProps) {
  const [viewMode, setViewMode] = useState<"split" | "code">("split");

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex-1">
          <h2 className="text-lg font-medium">{diagram.name}</h2>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date(diagram.updatedAt).toLocaleString()}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setViewMode(viewMode === "split" ? "code" : "split")}
          >
            {viewMode === "split" ? "Code Only" : "Split View"}
          </Button>
          <Button 
            onClick={onSave} 
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className={`grid ${viewMode === "split" ? "grid-cols-2" : "grid-cols-1"} gap-0 h-[600px]`}>
        <div className="border-r">
          <textarea
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none"
            placeholder="Enter your PlantUML code here..."
            disabled={isProcessing}
          />
        </div>
        
        {viewMode === "split" && (
          <div className="p-4 overflow-auto">
            <div className="flex items-center justify-center h-full border rounded-md overflow-hidden">
              <img
                src={diagram.imageUrl}
                alt={diagram.name}
                width={600}
                height={400}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}