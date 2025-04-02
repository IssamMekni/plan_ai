// src/app/project/[slug]/edit/components/AiAssistant.tsx
"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, Wand2, AlertTriangle, Sparkles } from "lucide-react"; // Added Sparkles
import { generateSuggestionAction } from "../actions"; // Import the server action

interface AiAssistantProps {
  onSuggestionApplied: (newDiagramCode: string) => void; // Callback with generated code
  diagramName: string;            // Name of the current diagram
  currentDiagramCode: string;     // Current PlantUML code for context
}

export default function AiAssistant({
  onSuggestionApplied,
  diagramName,
  currentDiagramCode,
}: AiAssistantProps) {
  const [prompt, setPrompt] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, startTransition] = useTransition(); // Manages Server Action pending state

  // Clear error when the diagram context changes
  useEffect(() => {
    setError(null);
  }, [diagramName, currentDiagramCode]);

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (!prompt.trim() || isProcessing) return; // Basic validation

    setError(null); // Clear previous errors

    startTransition(async () => {
      console.log(`[AI Assistant] Calling action for diagram: "${diagramName}"`);
      try {
        const result = await generateSuggestionAction({
          userPrompt: prompt,
          diagramName,
          currentDiagramCode,
        });

        if (result.success && typeof result.data === 'string') {
          console.log("[AI Assistant] Action succeeded.");
          onSuggestionApplied(result.data); // Pass the new code up to the parent page
          // Optionally clear prompt: setPrompt("");
        } else {
          console.error("[AI Assistant] Action failed:", result.error);
          setError(result.error || "An unknown error occurred while generating the suggestion.");
        }
      } catch (err) {
        // Catch unexpected errors during the action call itself (less common with server actions)
        console.error("[AI Assistant] Unexpected error calling action:", err);
        setError("A client-side error occurred while initiating the AI request.");
      }
    });
  }, [prompt, isProcessing, diagramName, currentDiagramCode, startTransition, onSuggestionApplied]);


  // Function to generate quick prompt suggestions
  const getSuggestions = (): string[] => {
    const common = [
      "Fix syntax errors",
      "Improve readability (layout, spacing)",
      "Add comments explaining the diagram",
      "Make this diagram more concise",
      "Convert description to PlantUML", // More generative
    ];
    const plantUML = [
      "Add sequence numbers to messages",
      "Group participants using box/package",
      "Add notes to clarify steps",
      "Refactor common interactions into procedures/functions",
      "Show database entity interactions",
      "Add example method signatures to classes",
      "Define state transitions more clearly",
      "Use alt/else blocks for error handling",
    ];
    // Combine, deduplicate, and limit
    return [...new Set([...plantUML, ...common])].slice(0, 8);
  };

  return (
    <Card className="h-full flex flex-col border shadow-sm bg-background">
      <CardHeader className="py-3 px-4 border-b bg-muted/30">
        <CardTitle className="text-md flex items-center font-semibold">
          <Sparkles className="h-5 w-5 mr-2 text-primary" /> {/* Using Sparkles icon */}
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-4 space-y-4 overflow-y-auto">
        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-4 flex items-start">
             <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
             <div>
                 <AlertTitle className="font-semibold">Generation Error</AlertTitle>
                 <AlertDescription className="text-xs">{error}</AlertDescription>
             </div>
          </Alert>
        )}

        {/* Prompt Form */}
        <form onSubmit={handleFormSubmit} className="space-y-3">
          <div>
            <Textarea
              placeholder={`Ask AI to help with your "${diagramName || 'diagram'}"...\nE.g., "Add login sequence" or "Define User and Admin classes"`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] text-sm focus-visible:ring-primary resize-none" // Added resize-none
              disabled={isProcessing}
              aria-label="AI Prompt Input"
              required // Added basic HTML validation
            />
            <p className="text-xs text-muted-foreground mt-1">Describe the change you want to make.</p>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={!prompt.trim() || isProcessing}
            aria-live="polite"
            aria-busy={isProcessing}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Code
              </>
            )}
          </Button>
        </form>

        {/* Quick Prompts Section */}
        <div className="pt-4 border-t mt-auto"> {/* Pushed to bottom */}
          <h3 className="text-xs font-medium mb-2 text-muted-foreground uppercase tracking-wider">Try these</h3>
          <div className="flex flex-wrap gap-2">
            {getSuggestions().map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                className="text-xs px-2 py-1 h-auto border-dashed hover:border-solid hover:bg-secondary"
                onClick={() => {
                  setPrompt(suggestion);
                  setError(null); // Clear error when selecting
                }}
                disabled={isProcessing}
                title={suggestion} // Tooltip for longer text
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}