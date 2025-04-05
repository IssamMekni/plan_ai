"use client";
import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { encode } from "plantuml-encoder";
import { DiagramToolbar } from "./DiagramToolbar";
import { CodeEditor } from "./CodeEditor";
import { DiagramPreview } from "./DiagramPreview";
import AiAssistant from "../AiAssistant";

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
  const [viewMode, setViewMode] = useState<"split" | "code" | "preview">("split");
  const [editorMode, setEditorMode] = useState<"editor" | "ai" | "both">("editor");
  const diagramUrl = `http://localhost:3030/png/${encode(code)}`;
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // For resizable split view
  const [splitPosition, setSplitPosition] = useState(50); // 50% by default
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // For editor/ai split when both are shown
  const [editorSplitPosition, setEditorSplitPosition] = useState(50); // 50% by default
  const isEditorDraggingRef = useRef(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCode(diagram.code);
  }, [diagram]);

  const handleChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);
    onCodeChange(newCode);
  };

  useEffect(() => {
    if (!code || code.trim() === "") {
      const defaultTemplate = `@startuml
title ${diagram.name || "New Diagram"}
actor User
participant "Frontend" as FE
participant "Backend" as BE
database "Database" as DB
User -> FE: Request
activate FE
FE -> BE: API Call
activate BE
BE -> DB: Query
activate DB
DB --> BE: Result
deactivate DB
BE --> FE: Response
deactivate BE
FE --> User: Display
deactivate FE
@enduml`;
      setCode(defaultTemplate);
      onCodeChange(defaultTemplate);
    }
  }, [diagram.name]);

  // Handle main split view resizing (editor/preview)
  const startDragging = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopDragging);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Limit the range
    const limitedPosition = Math.max(20, Math.min(80, newPosition));
    setSplitPosition(limitedPosition);
  };

  const stopDragging = () => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopDragging);
  };

  // Handle editor split view resizing (editor/ai)
  const startEditorDragging = (e: React.MouseEvent) => {
    e.preventDefault();
    isEditorDraggingRef.current = true;
    document.addEventListener('mousemove', handleEditorMouseMove);
    document.addEventListener('mouseup', stopEditorDragging);
  };

  const handleEditorMouseMove = (e: MouseEvent) => {
    if (!isEditorDraggingRef.current || !editorContainerRef.current) return;
    
    const container = editorContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const newPosition = ((e.clientY - containerRect.top) / containerRect.height) * 100;
    
    // Limit the range
    const limitedPosition = Math.max(20, Math.min(80, newPosition));
    setEditorSplitPosition(limitedPosition);
  };

  const stopEditorDragging = () => {
    isEditorDraggingRef.current = false;
    document.removeEventListener('mousemove', handleEditorMouseMove);
    document.removeEventListener('mouseup', stopEditorDragging);
  };

  return (
    <Card className="h-full border bg-card text-card-foreground shadow-sm">
      <DiagramToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        onSave={onSave}
        isProcessing={isProcessing}
        diagramName={diagram.name}
        updatedAt={diagram.updatedAt}
      />
      
      {viewMode === "split" ? (
        <div ref={containerRef} className="flex h-[600px] relative">
          {/* Left panel */}
          <div 
            className="h-full overflow-hidden" 
            style={{ width: `${splitPosition}%` }}
          >
            <div className="flex flex-col h-full">
              {/* Custom Tailwind Tabs */}
              <div className="flex border-b">
                <button
                  className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                    editorMode === "editor" || editorMode === "both"
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setEditorMode(prevMode => 
                    prevMode === "ai" ? "both" : "editor"
                  )}
                >
                  PlantUML Editor
                </button>
                <button
                  className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                    editorMode === "ai" || editorMode === "both"
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setEditorMode(prevMode => 
                    prevMode === "editor" ? "both" : "ai"
                  )}
                >
                  AI Assistant
                </button>
                {editorMode === "both" && (
                  <button
                    className="ml-auto px-4 py-2 text-xs text-gray-500 hover:text-gray-700"
                    onClick={() => setEditorMode("editor")}
                  >
                    Reset View
                  </button>
                )}
              </div>
              
              {/* Tab Content */}
              <div className="flex-1 overflow-hidden" ref={editorContainerRef}>
                {editorMode === "editor" && (
                  <div className="h-full">
                    <CodeEditor code={code} onChange={handleChange} />
                  </div>
                )}
                
                {editorMode === "ai" && (
                  <div className="h-full">
                    {children}
                  </div>
                )}
                
                {editorMode === "both" && (
                  <div className="flex flex-col h-full relative">
                    {/* Editor panel */}
                    <div 
                      className="overflow-hidden" 
                      style={{ height: `${editorSplitPosition}%` }}
                    >
                      <CodeEditor code={code} onChange={handleChange} />
                    </div>
                    
                    {/* Horizontal resizer */}
                    <div 
                      className="h-1 bg-gray-200 hover:bg-primary hover:h-1 cursor-row-resize w-full relative"
                      onMouseDown={startEditorDragging}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-1 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* AI Assistant panel */}
                    <div 
                      className="flex-1 overflow-auto" 
                      style={{ height: `${100 - editorSplitPosition}%` }}
                    >
                      {children}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Vertical resizer */}
          <div 
            className="w-1 bg-gray-200 hover:bg-primary hover:w-1 cursor-col-resize h-full relative"
            onMouseDown={startDragging}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
          
          {/* Right panel - Preview */}
          <div 
            className="h-full" 
            style={{ width: `${100 - splitPosition}%` }}
          >
            <DiagramPreview diagramUrl={diagramUrl} diagramName={diagram.name} />
          </div>
        </div>
      ) : (
        <div className="h-[600px]">
          {viewMode === "code" && (
            <div className="h-full">
              <div className="flex flex-col h-full">
                {/* Custom Tailwind Tabs */}
                <div className="flex border-b">
                  <button
                    className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                      editorMode === "editor" || editorMode === "both"
                        ? "border-b-2 border-primary text-primary"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setEditorMode(prevMode => 
                      prevMode === "ai" ? "both" : "editor"
                    )}
                  >
                    PlantUML Editor
                  </button>
                  <button
                    className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                      editorMode === "ai" || editorMode === "both"
                        ? "border-b-2 border-primary text-primary"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setEditorMode(prevMode => 
                      prevMode === "editor" ? "both" : "ai"
                    )}
                  >
                    AI Assistant
                  </button>
                  {editorMode === "both" && (
                    <button
                      className="ml-auto px-4 py-2 text-xs text-gray-500 hover:text-gray-700"
                      onClick={() => setEditorMode("editor")}
                    >
                      Reset View
                    </button>
                  )}
                </div>
                
                {/* Tab Content for code-only view */}
                <div className="flex-1 overflow-hidden" ref={editorContainerRef}>
                  {editorMode === "editor" && (
                    <div className="h-full">
                      <CodeEditor code={code} onChange={handleChange} />
                    </div>
                  )}
                  
                  {editorMode === "ai" && (
                    <div className="h-full">
                      {children}
                    </div>
                  )}
                  
                  {editorMode === "both" && (
                    <div className="flex flex-col h-full relative">
                      {/* Editor panel */}
                      <div 
                        className="overflow-hidden" 
                        style={{ height: `${editorSplitPosition}%` }}
                      >
                        <CodeEditor code={code} onChange={handleChange} />
                      </div>
                      
                      {/* Horizontal resizer */}
                      <div 
                        className="h-1 bg-gray-200 hover:bg-primary hover:h-1 cursor-row-resize w-full relative"
                        onMouseDown={startEditorDragging}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-1 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* AI Assistant panel */}
                      <div 
                        className="flex-1 overflow-auto" 
                        style={{ height: `${100 - editorSplitPosition}%` }}
                      >
                        {children}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {viewMode === "preview" && (
            <DiagramPreview diagramUrl={diagramUrl} diagramName={diagram.name} />
          )}
        </div>
      )}
    </Card>
  );
}