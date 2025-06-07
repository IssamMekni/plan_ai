// DiagramPreview.tsx
interface DiagramPreviewProps {
    diagramUrl: string;
    diagramName: string;
  }
  
  export function DiagramPreview({ diagramUrl, diagramName }: DiagramPreviewProps) {
    return (
      <div className="p-4 overflow-auto bg-background z-10">
        <div className="flex flex-col h-full">
          <div className="flex-1 flex items-center justify-center border rounded-md overflow-hidden bg-white" style={{zIndex: 10}}>
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