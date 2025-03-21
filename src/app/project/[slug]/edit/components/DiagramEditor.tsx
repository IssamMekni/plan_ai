"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, RefreshCw } from "lucide-react";
import Editor from "@monaco-editor/react";
import { encode } from "plantuml-encoder";

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
  onCodeChange,
  onSave,
  isProcessing,
}: DiagramEditorProps) {
  const [viewMode, setViewMode] = useState<"split" | "code">("split");
  const [code, setCode] = useState(diagram.code);
  const diagramUrl = `http://www.plantuml.com/plantuml/png/${encode(code)}`;

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
            onClick={() => setViewMode((prev) => (prev === "split" ? "code" : "split"))}
          >
            {viewMode === "split" ? "Code Only" : "Split View"}
          </Button>
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

      <div className={`grid ${viewMode === "split" ? "grid-cols-2" : "grid-cols-1"} gap-0 h-[600px]`}>
        <div className="border-r">
          <Editor
            value={code}
            className="w-full h-full"
            defaultLanguage="plaintext"
            onChange={handleChange}
            options={{ minimap: { enabled: false }, wordWrap: "on" }}
          />
        </div>

        {viewMode === "split" && (
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
