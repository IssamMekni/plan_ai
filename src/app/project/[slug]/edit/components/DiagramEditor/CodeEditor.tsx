// CodeEditor.tsx
import dynamic from "next/dynamic";
import type * as Monaco from "monaco-editor";
import { configurePlantUMLLanguage } from "./PlantUMLConfig";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface CodeEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
}

export function CodeEditor({ code, onChange }: CodeEditorProps) {
  const handleEditorDidMount = (editor: any, monaco: typeof Monaco) => {
    configurePlantUMLLanguage(monaco);
    monaco.editor.setTheme("plantumlTheme");
    editor.focus();
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      document.querySelector<HTMLButtonElement>("#save-button")?.click();
    });
  };

  return (
    <div className="h-full max-h-screen">
      <Editor
        value={code}
        className="w-full h-full"
        defaultLanguage="plantuml"
        language="plantuml"
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          wordWrap: "on",
          fontFamily:
            "'JetBrains Mono', 'Fira Code', Menlo, Monaco, 'Courier New', monospace",
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
  );
}
