// app/project/[id]/edit/components/AiAssistant.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Wand2 } from "lucide-react";

interface AiAssistantProps {
  onSuggestion: (prompt: string) => void;
  diagramName: string;
  isProcessing: boolean;
}

export default function AiAssistant({ 
  onSuggestion, 
  diagramName,
  isProcessing 
}: AiAssistantProps) {
  const [prompt, setPrompt] = useState<string>("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSuggestion(prompt);
  };

  const getSuggestions = (): string[] => {
    const commonSuggestions = [
      "Fix syntax errors in my diagram",
      "Make this diagram more readable"
    ];
    
    const typeSuggestions: { [key: string]: string[] } = {
      "Class Diagram": [
        "Add getter and setter methods to all classes",
        "Convert to a proper MVC architecture"
      ],
      "Sequence Diagram": [
        "Add error handling flows",
        "Optimize the communication flow"
      ],
      "Use Case Diagram": [
        "Add more detailed actor relationships",
        "Separate into primary and secondary use cases"
      ],
      "Activity Diagram": [
        "Add parallel processing paths",
        "Add decision points for error handling"
      ]
    };
    
    return [
      ...(typeSuggestions[diagramName] || []),
      ...commonSuggestions
    ];
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">AI Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              placeholder="Describe what you want to do with your diagram..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[150px]"
              disabled={isProcessing}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!prompt.trim() || isProcessing}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Suggestion
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Quick prompts</h3>
          <div className="flex flex-wrap gap-2">
            {getSuggestions().map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setPrompt(suggestion)}
                disabled={isProcessing}
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