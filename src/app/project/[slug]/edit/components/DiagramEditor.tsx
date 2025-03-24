"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, RefreshCw } from "lucide-react";
import Editor from "@monaco-editor/react";
import { encode } from "plantuml-encoder";
import { env } from "process";
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
}



export default function DiagramEditor({
  diagram,
  onCodeChange,
  onSave,
  isProcessing,
}: DiagramEditorProps) {
  const [viewMode, setViewMode] = useState<"split" | "code" | "preview">("split");
  const [code, setCode] = useState(diagram.code);
  const diagramUrl = `${"http://localhost:3030"}/svg/${encode(code)}`;

  useEffect(() => {
    setCode(diagram.code);
  }, [diagram]);

  const handleChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);
    onCodeChange(newCode);
  };


  return (
    <Card className="h-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-medium">{diagram.name}</h2>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date(diagram.updatedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="flex items-center rounded-md border bg-background p-1 text-muted-foreground w-fit">
            <button
              onClick={() => setViewMode("split")}
              className={`hidden sm:inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ${
                viewMode === "split" ? "bg-primary text-primary-foreground" : "hover:bg-muted hover:text-foreground"
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode("code")}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ${
                viewMode === "code" ? "bg-primary text-primary-foreground" : "hover:bg-muted hover:text-foreground"
              }`}
            >
              Code Only
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ${
                viewMode === "preview" ? "bg-primary text-primary-foreground" : "hover:bg-muted hover:text-foreground"
              }`}
            >
              Preview Only
            </button>
          </div>
          <Button onClick={onSave} disabled={isProcessing}>
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
      <div className={`grid ${viewMode === "split" ? "md:grid-cols-2" : "grid-cols-1"} gap-0 h-[600px]`}>
        {(viewMode === "split" || viewMode === "code") && (
          <div className="border-r">
            <Editor
              value={code}
              className="w-full h-full"
              defaultLanguage="plaintext"
              onChange={handleChange}
              theme="vs-dark"
              options={{ minimap: { enabled: false }, wordWrap: "on" }}
            />
          </div>
        )}
        {(viewMode === "split" || viewMode === "preview") && (
          <div className="p-4 overflow-auto">
            <div className="flex items-center justify-center h-full border rounded-md overflow-hidden">
              <img
                src={diagramUrl}
                alt={diagram.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
