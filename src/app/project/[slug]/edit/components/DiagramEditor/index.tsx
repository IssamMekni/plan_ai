"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
// import { encode } from "plantuml-encoder";
import { DiagramToolbar } from "./DiagramToolbar";
import { CodeEditor } from "./CodeEditor";
import { DiagramPreview } from "./DiagramPreview";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface Diagram {
  id: string;
  name: string;
  code: string;
  imageUrl: string;
  updatedAt: string;
}

interface DiagramEditorProps {
  diagram: Diagram;
  onCodeChange: (newCode: string) => void;
  onSave: () => void;
  code: string;
  setCode: (newCode: string) => void;
  isProcessing: boolean;
  children?: React.ReactNode;
}

export default function DiagramEditor({
  diagram,
  onCodeChange,
  onSave,
  isProcessing,
  children,
  code,
  setCode,
}: DiagramEditorProps) {
  const [viewMode, setViewMode] = useState<"split" | "code" | "preview">(
    "split"
  );
  const [editorMode, setEditorMode] = useState<"editor" | "ai">("editor");
  const [diagramUrl, setDiagramUrl] = useState<string | null>("");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCode(diagram.code);
  }, [diagram]);

  const fetchImgDiagram = async (code: string) => {
    try {
      const response = await fetch(`/api/diagrams/image`, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: code,
      });
  
      const blob = await response.blob();
      
      const url = URL.createObjectURL(blob);
      setDiagramUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev); // clean up old blob URL
        return url;
      });
    } catch (err) {
      console.error("Failed to fetch diagram:", err);
    }
  };
  
  useEffect(() => {
    if (timeoutId) clearTimeout(timeoutId);

    const id = setTimeout(() => {
      fetchImgDiagram(code);
    }, 500); // debounce: 500ms after typing stops

    setTimeoutId(id);
    return () => clearTimeout(id); // clean on unmount
  }, [code]);

  const handleChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);
    onCodeChange(newCode);
  };

  return (
    <Card className="h-full border bg-card text-card-foreground shadow-sm z-10">
      <DiagramToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        onSave={onSave}
        isProcessing={isProcessing}
        diagramName={diagram.name}
        updatedAt={diagram.updatedAt}
      />

      <div className={`h-[600px] ${viewMode === "split" ? "" : "hidden"}`}>
        <ResizablePanelGroup direction="horizontal">
          {/* Left panel */}
          <ResizablePanel defaultSize={50} minSize={20} maxSize={80}>
            <div className="flex flex-col h-full">
              {/* Custom Tailwind Tabs */}
              <div className="flex border-b">
                <button
                  className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                    editorMode === "editor"
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setEditorMode("editor")}
                >
                  PlantUML Editor
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                    editorMode === "ai"
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setEditorMode("ai")}
                >
                  AI Assistant
                </button>
              </div>

              {/* Tab Content */}
              <div className={`flex-1${editorMode === "editor" ? "" : "overflow-hidden"}`}>
                <div className={`h-full ${editorMode === "editor" ? "" : "hidden"}`}>
                  <CodeEditor code={code} onChange={handleChange} />
                </div>

                <div className={`h-full ${editorMode === "ai" ? "" : "hidden"}`}>
                  {children}
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right panel - Preview */}
          <ResizablePanel defaultSize={50}>
            <DiagramPreview
              diagramUrl={""+diagramUrl}
              diagramName={diagram.name}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div className={`h-[600px] ${viewMode === "preview" ? "" : "hidden"}`}>
        <DiagramPreview
          diagramUrl={""+diagramUrl}
          diagramName={diagram.name}
        />
      </div>
    </Card>
  );
}