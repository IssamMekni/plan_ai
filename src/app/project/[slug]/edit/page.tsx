"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProjectHeader from "./components/ProjectHeader";
import DiagramList from "./components/DiagramList";
import DiagramEditor from "./components/DiagramEditor/index";
import AiAssistant from "./components/AiAssistant";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Diagram {
  id: string;
  name: string;
  code: string;
  imageUrl: string;
  updatedAt: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  diagrams: Diagram[];
}

export default function ProjectEditPage() {
  const params = useParams<{
    slug: string;
    id: string;
  }>();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeDiagram, setActiveDiagram] = useState<Diagram | null>(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.slug}`);
        if (!response.ok) throw new Error("Failed to fetch project");
        const data: Project = await response.json();
        setProject(data);

        if (data.diagrams && data.diagrams.length > 0) {
          setActiveDiagram(data.diagrams[0]);
          setEditorContent(data.diagrams[0].code);
          setCode(data.diagrams[0].code);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast({
          title: "Error",
          description: "Failed to load project data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.slug, toast]);

  const handleSelectDiagram = async (diagram: Diagram) => {
    // Save current diagram before switching
    if (activeDiagram && code !== activeDiagram.code) {
      await handleSaveDiagram();
    }
    
    setActiveDiagram(diagram);
    setEditorContent(diagram.code);
    setCode(diagram.code);
  };

  const handleCodeChange = (newCode: string) => {
    setEditorContent(newCode);
    setCode(newCode);
  };

  const handleSaveDiagram = async () => {
    if (!activeDiagram || !project) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/projects/${project.id}/diagrams/${activeDiagram.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code }),
      });

      if (!response.ok) throw new Error("Failed to save diagram");

      const updatedDiagram: Diagram = await response.json();

      setActiveDiagram(updatedDiagram);
      setProject((prev) =>
        prev
          ? {
              ...prev,
              diagrams: prev.diagrams.map((d) =>
                d.id === updatedDiagram.id ? updatedDiagram : d
              ),
            }
          : null
      );

      toast({
        title: "Success",
        description: "Diagram saved successfully",
      });
    } catch (error) {
      console.error("Error saving diagram:", error);
      toast({
        title: "Error",
        description: "Failed to save diagram",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateDiagram = async (name: string) => {
    if (!project) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/projects/${project.id}/diagrams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          code: "@startuml\n\n@enduml",
        }),
      });

      if (!response.ok) throw new Error("Failed to create diagram");

      const newDiagram: Diagram = await response.json();

      setProject((prev) =>
        prev
          ? {
              ...prev,
              diagrams: [...prev.diagrams, newDiagram],
            }
          : null
      );

      setActiveDiagram(newDiagram);
      setEditorContent(newDiagram.code);
      setCode(newDiagram.code);

      toast({
        title: "Success",
        description: "New diagram created",
      });
    } catch (error) {
      console.error("Error creating diagram:", error);
      toast({
        title: "Error",
        description: "Failed to create new diagram",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteDiagram = async (diagramId: string) => {
    if (!window.confirm("Are you sure you want to delete this diagram?")) {
      return;
    }

    if (!project) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/projects/${project.id}/diagrams/${diagramId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete diagram");

      const updatedDiagrams = project.diagrams.filter((d) => d.id !== diagramId);
      setProject((prev) =>
        prev
          ? {
              ...prev,
              diagrams: updatedDiagrams,
            }
          : null
      );

      // If we're deleting the active diagram, switch to another one or clear
      if (activeDiagram && activeDiagram.id === diagramId) {
        if (updatedDiagrams.length > 0) {
          const nextDiagram = updatedDiagrams[0];
          setActiveDiagram(nextDiagram);
          setEditorContent(nextDiagram.code);
          setCode(nextDiagram.code);
        } else {
          setActiveDiagram(null);
          setEditorContent("");
          setCode("");
        }
      }

      toast({
        title: "Success",
        description: "Diagram deleted",
      });
    } catch (error) {
      console.error("Error deleting diagram:", error);
      toast({
        title: "Error",
        description: "Failed to delete diagram",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Updated AI suggestion handler for conversational approach
  const handleAiSuggestion = (newCode: string) => {
    setCode(newCode);
    setEditorContent(newCode);
    
    toast({
      title: "AI Applied",
      description: "AI suggestion applied to diagram",
    });
  };

  // Auto-save functionality (optional)
  useEffect(() => {
    if (!activeDiagram || code === activeDiagram.code) return;

    const autoSaveTimer = setTimeout(() => {
      handleSaveDiagram();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [code, activeDiagram]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading project...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Project not found</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-4">
      <ProjectHeader project={project} />

      <div className="">
        <div className="">
          <DiagramList
            diagrams={project.diagrams}
            activeDiagram={activeDiagram}
            onSelectDiagram={handleSelectDiagram}
            onCreateDiagram={handleCreateDiagram}
            onDeleteDiagram={handleDeleteDiagram}
            isProcessing={isProcessing}
          />
        </div>

        <div className="lg:col-span-3">
          {activeDiagram ? (
            <div className="space-y-4">
              <DiagramEditor
                diagram={activeDiagram}
                onCodeChange={handleCodeChange}
                onSave={handleSaveDiagram}
                isProcessing={isProcessing}
                code={code}
                setCode={setCode}
              >
                <AiAssistant
                onSuggestionApplied={handleAiSuggestion}
                diagramName={activeDiagram.name}
                currentDiagramCode={code}
                diagramType="sequence" // You might want to derive this from the diagram or make it configurable
                model="gemini-2.0-flash" // You might want to make this configurable
                diagramId={activeDiagram.id} // Pass the diagram ID for conversation persistence
                ollamaBaseUrl="http://localhost:11434" // Make this configurable if needed
                />
                </DiagramEditor>
            </div>
          ) : (
            <div className="border rounded-md p-8 text-center text-muted-foreground">
              <p>No diagram selected. Create or select a diagram to edit.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}