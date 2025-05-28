"use client";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, Wand2, AlertTriangle, Sparkles, MessageCircle, Trash2, User, Bot } from "lucide-react";

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isCodeResponse?: boolean;
}

interface AiAssistantProps {
  onSuggestionApplied: (newDiagramCode: string) => void;
  diagramName: string;
  currentDiagramCode: string;
  diagramType?: string;
  model?: string;
  diagramId: string; // New required prop for diagram-specific conversations
  ollamaBaseUrl?: string;
}

export default function AiAssistant({
  onSuggestionApplied,
  diagramName,
  currentDiagramCode,
  diagramType = 'sequence',
  model = 'gemini-2.0-flash',
  diagramId,
  ollamaBaseUrl = 'http://localhost:11434'
}: AiAssistantProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [showConversation, setShowConversation] = useState(false);
  const [clearingConversation, setClearingConversation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory]);

  // Load existing conversation when diagramId changes
  useEffect(() => {
    if (diagramId) {
      loadExistingConversation();
    }
  }, [diagramId]);

  // Load existing conversation for the current diagram
  const loadExistingConversation = async () => {
    try {
      // Make an initial request to potentially load existing conversation
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: "", // Empty prompt to just load conversation
          currentCode: currentDiagramCode,
          diagramType,
          model,
          conversationHistory: [],
          diagramId,
          maxHistoryLength: 10,
          loadOnly: true // Flag to indicate we're just loading
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.conversationHistory && data.conversationHistory.length > 0) {
          setConversationHistory(data.conversationHistory);
          setShowConversation(true);
        }
        if (data.sessionId) {
          setSessionId(data.sessionId);
        }
      }
    } catch (error) {
      console.error('Error loading existing conversation:', error);
      // Silently fail as this is just for loading existing data
    }
  };

  // Handle input change
  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setPrompt(event.target.value);
  }

  // Enhanced submission with conversation support
  async function handleGenerate() {
    if (!prompt.trim() || loading) return;

    const userMessage = prompt.trim();
    setPrompt("");
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Add user message to conversation immediately
    const newUserMessage: ConversationMessage = {
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    };

    setConversationHistory(prev => [...prev, newUserMessage]);
    setShowConversation(true);

    try {
      // Use the updated API endpoint
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage,
          currentCode: currentDiagramCode,
          diagramType,
          model,
          ollamaBaseUrl,
          conversationHistory,
          sessionId,
          maxHistoryLength: 10,
          diagramId // Include diagramId for conversation persistence
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data = await response.json();

      // Update conversation history with the full history from backend
      setConversationHistory(data.conversationHistory || []);
      
      // Update session ID if provided
      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
      }

      // If the response contains code, apply it to the diagram
      if (data.isCodeResponse && data.suggestedCode) {
        onSuggestionApplied(data.suggestedCode);
        setSuccessMessage("Diagram updated successfully!");
      } else {
        setSuccessMessage("Response received!");
      }

      // Clear success message after a delay
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to get AI response. Please try again.";
      setError(errorMessage);
      
      // Add error message to conversation
      const errorResponse: ConversationMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: Date.now()
      };
      
      setConversationHistory(prev => [...prev, errorResponse]);
      
      // Clear error message after a delay
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  }

  // Clear the input field
  function handleClear() {
    setPrompt("");
  }

  // Clear conversation history
  async function clearConversation() {
    if (!window.confirm("Are you sure you want to clear the conversation history?")) {
      return;
    }

    setClearingConversation(true);
    
    try {
      // Call the DELETE endpoint to clear conversation
      const response = await fetch('/api/ai', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          diagramId,
          sessionId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to clear conversation');
      }

      // Clear local state
      setConversationHistory([]);
      setSessionId('');
      setShowConversation(false);
      setSuccessMessage("Conversation cleared successfully!");
      
      // Clear success message after a delay
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (error) {
      console.error('Error clearing conversation:', error);
      setError("Failed to clear conversation. Please try again.");
      
      // Clear error message after a delay
      setTimeout(() => setError(null), 5000);
    } finally {
      setClearingConversation(false);
    }
  }

  // Handle Enter key press
  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  }

  // Format message content
  const formatMessage = (content: string) => {
    // Basic formatting for code blocks
    if (content.includes('@startuml') || content.includes('@enduml')) {
      return (
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto mt-1">
          <code>{content}</code>
        </pre>
      );
    }
    
    // Format regular text with line breaks
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Sparkles className="text-blue-500" />
            AI Assistant for {diagramName}
          </div>
          <div className="flex items-center gap-2">
            {conversationHistory.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConversation(!showConversation)}
                  className="flex items-center gap-1"
                >
                  <MessageCircle className="w-4 h-4" />
                  {showConversation ? 'Hide Chat' : `Show Chat (${conversationHistory.length})`}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearConversation}
                  disabled={clearingConversation}
                  className="flex items-center gap-1"
                >
                  {clearingConversation ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {clearingConversation ? 'Clearing...' : 'Clear'}
                </Button>
              </>
            )}
          </div>
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

        {/* Conversation History */}
        {showConversation && conversationHistory.length > 0 && (
          <Card className="mb-4 max-h-80 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Conversation History</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                {conversationHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : message.isCodeResponse
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        {message.role === 'user' ? (
                          <User className="w-3 h-3" />
                        ) : (
                          <Bot className="w-3 h-3" />
                        )}
                        <span className="text-xs opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                        {message.isCodeResponse && (
                          <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-1 rounded">
                            CODE
                          </span>
                        )}
                      </div>
                      <div>
                        {formatMessage(message.content)}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg">
                      <div className="flex items-center space-x-1">
                        <Bot className="w-3 h-3" />
                        <div className="flex space-x-1 ml-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Input Area */}
        <Textarea
          value={prompt}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Ask about your diagram, request changes, or get help with PlantUML syntax..."
          rows={4}
          className="mb-4"
          disabled={loading}
        />

        <div className="flex gap-2">
          <Button
            onClick={handleGenerate}
            className="flex items-center gap-2"
            disabled={loading || !prompt.trim()}
          >
            {loading ? (
              <RefreshCw className="animate-spin w-4 h-4" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            {loading ? "Processing..." : "Send"}
          </Button>

          <Button
            variant="outline"
            onClick={handleClear}
            className="flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4" />
            Clear Input
          </Button>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Press Enter to send, Shift+Enter for new line
          {conversationHistory.length > 0 && (
            <span className="ml-2">• {conversationHistory.length} messages in conversation</span>
          )}
          {sessionId && (
            <span className="ml-2">• Session: {sessionId.slice(-8)}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}