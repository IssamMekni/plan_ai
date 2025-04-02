// DiagramEditor.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { encode } from "plantuml-encoder";
import { DiagramToolbar } from "./DiagramToolbar";
import { CodeEditor } from "./CodeEditor";
import { DiagramPreview } from "./DiagramPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  isProcessing: boolean;
  children?: React.ReactNode;
}

export default function DiagramEditor({
  diagram,
  onCodeChange,
  onSave,
  isProcessing,
  children,
}: DiagramEditorProps) {
  const [viewMode, setViewMode] = useState<"split" | "code" | "preview">(
    "split"
  );
  const [code, setCode] = useState(diagram.code);
  const diagramUrl = `http://localhost:3030/png/${encode(code)}`;
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setCode(diagram.code);
  }, [diagram]);

  const handleChange = (value: string | undefined) => {
    console.log(value);

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
      <div
        className={`grid ${
          viewMode === "split" ? "md:grid-cols-2" : "grid-cols-1"
        } gap-0 h-[600px]`}
      >
        {(viewMode === "split" || viewMode === "code") && (
          <>
            <Tabs defaultValue="editor" className="w-full h-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="editor">PlantUML Editor</TabsTrigger>
                <TabsTrigger value="ai">AI Assistant</TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="mt-0 h-full">
                <CodeEditor code={code} onChange={handleChange} />
              </TabsContent>

              <TabsContent value="ai" className="mt-0">
                {children}
              </TabsContent>
            </Tabs>
          </>
        )}
        {(viewMode === "split" || viewMode === "preview") && (
          <DiagramPreview diagramUrl={diagramUrl} diagramName={diagram.name} />
        )}
      </div>
    </Card>
  );
}
