// DiagramToolbar.tsx
import { Button } from "@/components/ui/button";
import { Save, RefreshCw } from "lucide-react";
// import { RefObject } from "react";

interface DiagramToolbarProps {
  viewMode: "split" | "code" | "preview";
  setViewMode: (mode: "split" | "code" | "preview") => void;
  onSave: () => void;
  isProcessing: boolean;
  diagramName: string;
  updatedAt: string;
  // buttonRef: RefObject<HTMLButtonElement>;
}

export function DiagramToolbar({
  viewMode,
  setViewMode,
  onSave,
  isProcessing,
  diagramName,
  updatedAt,
}: DiagramToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b gap-4">
      <div className="flex-1">
        <h2 className="text-lg font-medium">{diagramName}</h2>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date(updatedAt).toLocaleString()}
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
        <div className="flex items-center rounded-md border bg-background p-1 text-muted-foreground w-fit">
          <button
            onClick={() => setViewMode("split")}
            className={`hidden sm:inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              viewMode === "split" ? "bg-primary text-primary-foreground" : "hover:bg-muted hover:text-foreground"
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setViewMode("code")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              viewMode === "code" ? "bg-primary text-primary-foreground" : "hover:bg-muted hover:text-foreground"
            }`}
          >
            Code Only
          </button>
          <button
            onClick={() => setViewMode("preview")}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              viewMode === "preview" ? "bg-primary text-primary-foreground" : "hover:bg-muted hover:text-foreground"
            }`}
          >
            Preview Only
          </button>
        </div>
        <Button 
          onClick={onSave} 
          disabled={isProcessing}
          variant="default"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          id="save-button"
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
  );
}