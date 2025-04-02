// DiagramPreview.tsx
interface DiagramPreviewProps {
    diagramUrl: string;
    diagramName: string;
  }
  
  export function DiagramPreview({ diagramUrl, diagramName }: DiagramPreviewProps) {
    return (
      <div className="p-4 overflow-auto bg-background">
        <div className="flex flex-col h-full">
          <div className="flex-1 flex items-center justify-center border rounded-md overflow-hidden bg-white">
            <img
              src={diagramUrl}
              alt={diagramName}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            <p>Preview updates automatically as you type. Press Ctrl+S (Cmd+S on Mac) to save changes.</p>
          </div>
        </div>
      </div>
    );
  }