"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, Wand2, AlertTriangle, Sparkles } from "lucide-react";

interface AiAssistantProps {
  onSuggestionApplied: (newDiagramCode: string) => void;
  diagramName: string;
  currentDiagramCode: string;
  submitPrompt: (prompt: string) => Promise<string>;
}

export default function AiAssistant({
  onSuggestionApplied,
  diagramName,
  submitPrompt
}: AiAssistantProps) {

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  useEffect(() => {
    setPrompt("");
  }, [diagramName]);
  
  // Handle input change
  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setPrompt(event.target.value);
  }

  // Handle submission of the prompt
  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await submitPrompt(prompt);
      onSuggestionApplied(result);
      setSuccessMessage("New diagram code generated successfully!");
    } catch (error) {
      setError("Failed to generate diagram code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Clear the input field
  function handleClear() {
    setPrompt("");
  }

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <Sparkles className="text-blue-500" />
          AI Assistant for {diagramName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertTriangle className="w-4 h-4 mr-2" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {successMessage && (
          <Alert className="mb-4">
            <Wand2 className="w-4 h-4 mr-2" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <Textarea
          value={prompt}
          onChange={handleChange}
          placeholder="Describe the diagram changes or prompt here..."
          rows={4}
          className="mb-4"
        />
        
        <div className="flex gap-2">
          <Button
            onClick={handleGenerate}
            className="flex items-center gap-2"
            disabled={loading || !prompt.trim()}
          >
            {loading ? (
              <RefreshCw className="animate-spin" />
            ) : (
              <Wand2 />
            )}
            {loading ? "Generating..." : "Generate"}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleClear}
            className="flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
