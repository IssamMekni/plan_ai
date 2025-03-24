"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { PlusCircle, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
  isProcessing,
}: DiagramListProps) {
  const [newDiagramName, setNewDiagramName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const diagramsContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCreateSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!newDiagramName.trim()) return;
      onCreateDiagram(newDiagramName.trim());
      setNewDiagramName("");
      setIsCreating(false);
    },
    [newDiagramName, onCreateDiagram]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, diagram: Diagram) => {
      if (e.key === "Enter") onSelectDiagram(diagram);
    },
    [onSelectDiagram]
  );

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (diagramsContainerRef.current) {
      e.preventDefault();
      diagramsContainerRef.current.scrollLeft += e.deltaY;
    }
  }, []);

  useEffect(() => {
    const preventScroll = (e: WheelEvent) => {
      if (isHovering) {
        e.preventDefault();
        return false;
      }
    };

    if (isHovering && containerRef.current) {
      window.addEventListener("wheel", preventScroll, { passive: false });
    }

    return () => {
      window.removeEventListener("wheel", preventScroll);
    };
  }, [isHovering]);

  const diagramList = useMemo(
    () =>
      diagrams.map((diagram) => (
        <div
          key={diagram.id}
          tabIndex={0}
          role="button"
          className={`flex items-center justify-between p-2 rounded-md cursor-pointer min-w-32 max-w-full sm:max-w-48 flex-1 sm:flex-none transition
            ${
              activeDiagram?.id === diagram.id
                ? "bg-primary/10 border border-primary/20"
                : "hover:bg-accent focus:ring-2 focus:ring-primary"
            }`}
          onClick={() => {
            onSelectDiagram(diagram);
            setIsOpen(false);
          }}
          onKeyDown={(e) => handleKeyDown(e, diagram)}
        >
          <div className="truncate mr-2">
            <p className="font-medium truncate text-sm">{diagram.name}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(diagram.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteDiagram(diagram.id);
            }}
            disabled={isProcessing}
            aria-label={`Delete ${diagram.name}`}
          >
            <Trash2 className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground hover:text-destructive" />
          </Button>
        </div>
      )),
    [
      diagrams,
      activeDiagram,
      onSelectDiagram,
      onDeleteDiagram,
      isProcessing,
      handleKeyDown,
    ]
  );

  return (
    <div
      ref={containerRef}
      className=" sm:fixed relative py-4 sm:p-0 sm:bottom-4 z-50  max-w-3xl md:left-1/2 md:-translate-x-1/2"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Card className="bg-background/50 backdrop-blur-sm shadow-lg">
        <Button
          variant="ghost"
          size="default"
          className="w-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2 px-3 py-2 sm:min-w-96">
            diagrams({diagrams.length}):
            <CardTitle className="text-sm md:text-md font-medium ">
              {activeDiagram?.name}
            </CardTitle>
            {/* Toggle button for mobile dropdown */}
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </CardHeader>
        </Button>
        {/* Conditionally render the content in mobile view */}
        <CardContent
          className={`p-2 md:p-4 flex flex-col gap-2 transition-all duration-300 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          {isCreating ? (
            <form
              onSubmit={handleCreateSubmit}
              className="mb-2 flex flex-col gap-2"
            >
              <Input
                placeholder="Diagram name..."
                value={newDiagramName}
                onChange={(e) => setNewDiagramName(e.target.value)}
                disabled={isProcessing}
                autoFocus
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  size="sm"
                  className="flex-1 text-xs"
                  disabled={!newDiagramName.trim() || isProcessing}
                >
                  Create
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => setIsCreating(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : null}

          <div
            ref={diagramsContainerRef}
            onWheel={handleWheel}
            className="flex gap-2 justify-start max-h-40 md:max-h-60 overflow-y-hidden overflow-x-auto scroll-smooth
                       scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/30 hover:scrollbar-thumb-primary/50
                       px-1 py-2"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "var(--primary) transparent",
            }}
          >
            {diagrams.length === 0 ? (
              <div className="text-center py-2 text-muted-foreground w-full">
                <p className="text-sm">No diagrams yet</p>
                <p className="text-xs">Create one to get started</p>
              </div>
            ) : (
              diagramList
            )}
          </div>

          <div className="flex items-center justify-center">
            <Button
              className="p-2 md:p-4 h-auto"
              variant="ghost"
              size="sm"
              onClick={() => setIsCreating(true)}
              disabled={isProcessing}
              aria-label="Add new diagram"
            >
              <PlusCircle className="h-6 w-6 md:h-8 md:w-8" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
