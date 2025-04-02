"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, RefreshCw } from "lucide-react";
import { encode } from "plantuml-encoder";
// Type-only import for Monaco
import type * as Monaco from "monaco-editor";
import "@monaco-editor/react";

// Dynamically import the Editor component with SSR disabled
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

// PlantUML language configuration
const configurePlantUMLLanguage = (monaco: typeof Monaco) => {
  // Register PlantUML language
  monaco.languages.register({ id: 'plantuml' });

  // PlantUML language tokens and styles
  monaco.languages.setMonarchTokensProvider('plantuml', {
    defaultToken: '',
    tokenPostfix: '.plantuml',
    ignoreCase: true,

    brackets: [
      { open: '{', close: '}', token: 'delimiter.curly' },
      { open: '[', close: ']', token: 'delimiter.square' },
      { open: '(', close: ')', token: 'delimiter.parenthesis' },
    ],

    keywords: [
      'as', 'participant', 'actor', 'boundary', 'control', 'entity', 'database', 'collections',
      'start', 'stop', 'if', 'then', 'else', 'endif', 'repeat', 'while', 'endwhile', 'fork', 'again',
      'end', 'top', 'bottom', 'left', 'right', 'of', 'on', 'link', 'over', 'note', 'legend',
      'class', 'interface', 'abstract', 'annotation', 'enum', 'component', 'state', 'object',
      'artifact', 'folder', 'rectangle', 'node', 'frame', 'cloud', 'database', 'storage',
      'agent', 'usecase', 'activity', 'sequence', 'package', 'namespace',
      'startuml', 'enduml', 'skinparam', 'title', 'header', 'footer', 'hide', 'show',
      'activate', 'deactivate', 'destroy', 'create', 'return'
    ],

    operators: [
      '->', '<-', '<->', '->>', '<<-', '-->', '<--', '<-->', '..>', '<..', '..', ':', '::', '+',
      '++', '-', '--', '||', '|', '<|', '|>', '*', 'o', '<o', 'o>', '#', '<#', '#>', 'x', '<x',
      'x>', '{', '}', '(', ')', '[', ']'
    ],

    // we include these common regular expressions
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    
    tokenizer: {
      root: [
        [/@[a-zA-Z]\w*/, 'annotation'],
        [/[a-zA-Z][\w$]*/, {
          cases: {
            '@keywords': 'keyword',
            '@default': 'identifier'
          }
        }],
        
        // Strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-terminated string
        [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
        
        // Comments
        [/'.*$/, 'comment'],
        [/\/\/.*$/, 'comment'],
        [/\/\*/, 'comment', '@comment'],
        
        // Operators
        [/@symbols/, {
          cases: {
            '@operators': 'operator',
            '@default': ''
          }
        }],
        
        // Numbers
        [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
        [/0[xX][0-9a-fA-F]+/, 'number.hex'],
        [/\d+/, 'number'],
        
        // Delimiters and operators
        [/[{}()\[\]]/, '@brackets'],
        [/[<>](?!@symbols)/, '@brackets'],
        [/[;,.]/, 'delimiter'],
        
        // Whitespace
        [/\s+/, 'white'],
      ],
      
      string: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
      ],
      
      comment: [
        [/[^\/*]+/, 'comment'],
        [/\/\*/, 'comment', '@push'],
        [/\*\//, 'comment', '@pop'],
        [/[\/*]/, 'comment']
      ]
    }
  });

  // PlantUML completions provider
  monaco.languages.registerCompletionItemProvider('plantuml', {
    provideCompletionItems: (model, position) => {
      const suggestions = [
        // Diagram types
        { label: 'startuml', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'startuml\n\n\nenduml', documentation: 'Start a PlantUML diagram' },
        { label: 'enduml', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'enduml', documentation: 'End a PlantUML diagram' },
        
        // Sequence diagram
        { label: 'actor', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'actor ${1:name}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Add an actor to the diagram' },
        { label: 'participant', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'participant "${1:name}"', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Add a participant to the diagram' },
        { label: '->',  kind: monaco.languages.CompletionItemKind.Operator, insertText: '${1:actor} -> ${2:target} : ${3:message}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Add a message arrow' },
        { label: '->>',  kind: monaco.languages.CompletionItemKind.Operator, insertText: '${1:actor} ->> ${2:target} : ${3:asynchronous message}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Add an asynchronous message arrow' },
        { label: '-->',  kind: monaco.languages.CompletionItemKind.Operator, insertText: '${1:actor} --> ${2:target} : ${3:dotted message}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Add a dotted message arrow' },
        { label: 'note',  kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'note ${1|left,right,over|} ${2:participant} : ${3:text}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Add a note to the diagram' },
        { label: 'activate',  kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'activate ${1:participant}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Activate a lifeline' },
        { label: 'deactivate',  kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'deactivate ${1:participant}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Deactivate a lifeline' },
        
        // Class diagram
        { label: 'class',  kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'class ${1:name} {\n\t${2:attribute}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Define a class' },
        { label: 'interface',  kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'interface ${1:name} {\n\t${2:method()}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Define an interface' },
        { label: 'extends',  kind: monaco.languages.CompletionItemKind.Keyword, insertText: '${1:class} extends ${2:parent}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Define inheritance relationship' },
        { label: 'implements',  kind: monaco.languages.CompletionItemKind.Keyword, insertText: '${1:class} implements ${2:interface}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Define implementation relationship' },
        
        // Use case diagram
        { label: 'usecase',  kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'usecase "${1:name}"', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Define a use case' },
        
        // Skinparam
        { label: 'skinparam', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'skinparam ${1:parameter} ${2:value}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Change diagram styling' },
        { label: 'skinparam sequence', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'skinparam sequence {\n\tArrowColor ${1:DeepSkyBlue}\n\tLifeLineBorderColor ${2:blue}\n\tParticipantBorderColor ${3:DeepSkyBlue}\n\tParticipantBackgroundColor ${4:DodgerBlue}\n\tParticipantFontColor ${5:white}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Set sequence diagram styling' },
        
        // Component diagram
        { label: 'component',  kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'component ${1:name}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Define a component' },
        { label: 'database',  kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'database ${1:name}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Define a database' },
        
        // Common elements
        { label: 'title',  kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'title ${1:Diagram Title}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Set diagram title' },
        { label: 'footer',  kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'footer ${1:footer text}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Add footer to diagram' },
      ];
      
      return { suggestions };
    }
  });

  // Define custom theme for PlantUML syntax highlighting  
  monaco.editor.defineTheme("plantumlTheme", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "", foreground: "d1d5db", background: "1e1e2e" },
      { token: "keyword", foreground: "c792ea" },
      { token: "string", foreground: "a3be8c" },
      { token: "comment", foreground: "6272a4" },
      { token: "operator", foreground: "89ddff" },
      { token: "number", foreground: "f78c6c" },
      { token: "delimiter", foreground: "89ddff" },
      { token: "annotation", foreground: "ffcb6b" },
      { token: "type", foreground: "82aaff" },
      { token: "identifier", foreground: "d1d5db" },
    ],
    colors: {
      "editor.background": "#1e1e2e",
      "editor.foreground": "#d1d5db",
      "editor.lineHighlightBackground": "#2e2e3e",
      "editorCursor.foreground": "#ffcc00",
      "editor.selectionBackground": "#3e4451",
      "editor.findMatchBackground": "#6272a4",
      "editor.findMatchHighlightBackground": "#3e4451",
      "editorSuggestWidget.background": "#1e1e2e",
      "editorSuggestWidget.border": "#2e2e3e",
      "editorSuggestWidget.selectedBackground": "#3e4451",
      "editorHoverWidget.background": "#1e1e2e",
      "editorHoverWidget.border": "#2e2e3e",
    },
  });
};

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
  const diagramUrl = ` http://172.16.136.235:3030/svg/${encode(code)}`;
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    setCode(diagram.code);
  }, [diagram]);

  const handleChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);
    onCodeChange(newCode);
  };

  const handleEditorDidMount = (editor: any, monaco: typeof Monaco) => {
    // Configure PlantUML language support
    configurePlantUMLLanguage(monaco);
    
    // Set the theme
    monaco.editor.setTheme("plantumlTheme");
    
    // Focus the editor
    editor.focus();
    
    // Add keyboard shortcuts for common operations
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      buttonRef.current?.click();
    });
  };

  // Create a default PlantUML diagram template if the code is empty
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
              className={`hidden sm:inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                viewMode === "split" ? "bg-primary text-primary-foreground" : "hover:bg-muted hover:text-foreground"
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode("code")}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                viewMode === "code" ? "bg-primary text-primary-foreground" : "hover:bg-muted hover:text-foreground"
              }`}
            >
              Code Only
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                viewMode === "preview" ? "bg-primary text-primary-foreground" : "hover:bg-muted hover:text-foreground"
              }`}
            >
              Preview Only
            </button>
          </div>
          <Button 
            onClick={onSave} 
            disabled={isProcessing}
            variant="default"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            ref={buttonRef}
          >
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
              defaultLanguage="plantuml"
              language="plantuml"
              onChange={handleChange}
              onMount={handleEditorDidMount}
              options={{ 
                minimap: { enabled: true },
                wordWrap: "on",
                fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
                fontSize: 14,
                lineHeight: 1.6,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                lineNumbers: "on",
                renderLineHighlight: "all",
                scrollbar: {
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10,
                  useShadows: false,
                },
                bracketPairColorization: {
                  enabled: true,
                },
                guides: {
                  bracketPairs: true,
                  indentation: true,
                },
                folding: true,
                tabSize: 2,
                autoIndent: "full",
                colorDecorators: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                formatOnPaste: true,
                formatOnType: true,
                smoothScrolling: true,
                suggest: {
                  showMethods: true,
                  showFunctions: true,
                  showConstructors: true,
                  showFields: true,
                  showVariables: true,
                  showClasses: true,
                  showStructs: true,
                  showInterfaces: true,
                  showModules: true,
                  showProperties: true,
                  showEvents: true,
                  // showInlineCompletions: true,
                },
                hover: {
                  enabled: true,
                  delay: 300,
                },
              }}
            />
          </div>
        )}
        {(viewMode === "split" || viewMode === "preview") && (
          <div className="p-4 overflow-auto bg-background">
            <div className="flex flex-col h-full">
              <div className="flex-1 flex items-center justify-center border rounded-md overflow-hidden bg-white">
                <img
                  src={diagramUrl}
                  alt={diagram.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                <p>Preview updates automatically as you type. Press Ctrl+S (Cmd+S on Mac) to save changes.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}