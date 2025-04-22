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
    await handleSaveDiagram();
    setActiveDiagram(diagram);
    setEditorContent(diagram.code);
  };

  const handleCodeChange = (newCode: string) => {
    setEditorContent(newCode);
  };

  const handleSaveDiagram = async () => {
    if (!activeDiagram) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/projects/${project?.id}/diagrams/${activeDiagram.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code }),
      });

      if (!response.ok) throw new Error("Failed to save diagram");

      // const imageResponse = await fetch(
      //   `/api/diagrams/${activeDiagram.id}/generate`,
      //   {
      //     method: "POST",
      //   }
      // );

      // if (!imageResponse.ok)
      //   throw new Error("Failed to generate diagram image");

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
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/projects/${project?.id}/diagrams`, {
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
    console.log(diagramId);

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/projects/${project?.id}/diagrams/${diagramId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete diagram");

      const updatedDiagrams =
        project?.diagrams.filter((d) => d.id !== diagramId) || [];
      setProject((prev) =>
        prev
          ? {
              ...prev,
              diagrams: updatedDiagrams,
            }
          : null
      );

      if (activeDiagram && activeDiagram.id === diagramId) {
        if (updatedDiagrams.length > 0) {
          setActiveDiagram(updatedDiagrams[0]);
          setEditorContent(updatedDiagrams[0].code);
        } else {
          setActiveDiagram(null);
          setEditorContent("");
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

  const handleAiSuggestion = async (prompt: string) => {
    if (!activeDiagram) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          currentCode: editorContent,
          diagramType: activeDiagram.name,
        }),
      });

      if (!response.ok) throw new Error("Failed to get AI suggestion");

      const { suggestedCode }: { suggestedCode: string } =
        await response.json();
        setCode(c => suggestedCode);
        setEditorContent(c=>suggestedCode)
        
      toast({
        title: "Success",
        description: "AI suggestion applied",
      });
    } catch (error) {
      console.error("Error getting AI suggestion:", error);
      toast({
        title: "Error",
        description: "Failed to get AI suggestion",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

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
    <div className=" mx-auto px-4 py-4">
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

        <div className="md:col-span-3">
          {activeDiagram ? (
            <DiagramEditor
              diagram={activeDiagram}
              onCodeChange={handleCodeChange}
              onSave={handleSaveDiagram}
              isProcessing={isProcessing}
              code={code}
              setCode={setCode}
            >
              <AiAssistant
                onSuggestionApplied={setEditorContent}
                diagramName={activeDiagram.name}
                currentDiagramCode={editorContent}
                submitPrompt={handleAiSuggestion}
              />
            </DiagramEditor>
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
