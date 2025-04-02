// PlantUMLConfig.ts
import type * as Monaco from "monaco-editor";

export const configurePlantUMLLanguage = (monaco: typeof Monaco) => {
  // Register PlantUML language
  monaco.languages.register({ id: "plantuml" });

  // PlantUML language tokens and styles
  monaco.languages.setMonarchTokensProvider("plantuml", {
    defaultToken: "",
    tokenPostfix: ".plantuml",
    ignoreCase: true,

    brackets: [
      { open: "{", close: "}", token: "delimiter.curly" },
      { open: "[", close: "]", token: "delimiter.square" },
      { open: "(", close: ")", token: "delimiter.parenthesis" },
    ],

    keywords: [
      "as",
      "participant",
      "actor",
      "boundary",
      "control",
      "entity",
      "database",
      "collections",
      "start",
      "stop",
      "if",
      "then",
      "else",
      "endif",
      "repeat",
      "while",
      "endwhile",
      "fork",
      "again",
      "end",
      "top",
      "bottom",
      "left",
      "right",
      "of",
      "on",
      "link",
      "over",
      "note",
      "legend",
      "class",
      "interface",
      "abstract",
      "annotation",
      "enum",
      "component",
      "state",
      "object",
      "artifact",
      "folder",
      "rectangle",
      "node",
      "frame",
      "cloud",
      "database",
      "storage",
      "agent",
      "usecase",
      "activity",
      "sequence",
      "package",
      "namespace",
      "startuml",
      "enduml",
      "skinparam",
      "title",
      "header",
      "footer",
      "hide",
      "show",
      "activate",
      "deactivate",
      "destroy",
      "create",
      "return",
    ],

    operators: [
      "->",
      "<-",
      "<->",
      "->>",
      "<<-",
      "-->",
      "<--",
      "<-->",
      "..>",
      "<..",
      "..",
      ":",
      "::",
      "+",
      "++",
      "-",
      "--",
      "||",
      "|",
      "<|",
      "|>",
      "*",
      "o",
      "<o",
      "o>",
      "#",
      "<#",
      "#>",
      "x",
      "<x",
      "x>",
      "{",
      "}",
      "(",
      ")",
      "[",
      "]",
    ],

    // we include these common regular expressions
    symbols: /[=><!~?:&|+\-*\/\^%]+/,

    tokenizer: {
      root: [
        [/@[a-zA-Z]\w*/, "annotation"],
        [
          /[a-zA-Z][\w$]*/,
          {
            cases: {
              "@keywords": "keyword",
              "@default": "identifier",
            },
          },
        ],

        // Strings
        [/"([^"\\]|\\.)*$/, "string.invalid"], // non-terminated string
        [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],

        // Comments
        [/'.*$/, "comment"],
        [/\/\/.*$/, "comment"],
        [/\/\*/, "comment", "@comment"],

        // Operators
        [
          /@symbols/,
          {
            cases: {
              "@operators": "operator",
              "@default": "",
            },
          },
        ],

        // Numbers
        [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
        [/0[xX][0-9a-fA-F]+/, "number.hex"],
        [/\d+/, "number"],

        // Delimiters and operators
        [/[{}()\[\]]/, "@brackets"],
        [/[<>](?!@symbols)/, "@brackets"],
        [/[;,.]/, "delimiter"],

        // Whitespace
        [/\s+/, "white"],
      ],

      string: [
        [/[^\\"]+/, "string"],
        [/\\./, "string.escape"],
        [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
      ],

      comment: [
        [/[^\/*]+/, "comment"],
        [/\/\*/, "comment", "@push"],
        [/\*\//, "comment", "@pop"],
        [/[\/*]/, "comment"],
      ],
    },
  });

  // PlantUML completions provider
  monaco.languages.registerCompletionItemProvider("plantuml", {
    provideCompletionItems: (model, position) => {
      const suggestions = [
        // Diagram types
        {
          label: "startuml",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "startuml\n\n\nenduml",
          documentation: "Start a PlantUML diagram",
        },
        {
          label: "enduml",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "enduml",
          documentation: "End a PlantUML diagram",
        },

        // Sequence diagram
        {
          label: "actor",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "actor ${1:name}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Add an actor to the diagram",
        },
        {
          label: "participant",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'participant "${1:name}"',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Add a participant to the diagram",
        },
        {
          label: "->",
          kind: monaco.languages.CompletionItemKind.Operator,
          insertText: "${1:actor} -> ${2:target} : ${3:message}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Add a message arrow",
        },
        {
          label: "->>",
          kind: monaco.languages.CompletionItemKind.Operator,
          insertText: "${1:actor} ->> ${2:target} : ${3:asynchronous message}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Add an asynchronous message arrow",
        },
        {
          label: "-->",
          kind: monaco.languages.CompletionItemKind.Operator,
          insertText: "${1:actor} --> ${2:target} : ${3:dotted message}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Add a dotted message arrow",
        },
        {
          label: "note",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "note ${1|left,right,over|} ${2:participant} : ${3:text}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Add a note to the diagram",
        },
        {
          label: "activate",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "activate ${1:participant}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Activate a lifeline",
        },
        {
          label: "deactivate",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "deactivate ${1:participant}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Deactivate a lifeline",
        },

        // Class diagram
        {
          label: "class",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "class ${1:name} {\n\t${2:attribute}\n}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Define a class",
        },
        {
          label: "interface",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "interface ${1:name} {\n\t${2:method()}\n}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Define an interface",
        },
        {
          label: "extends",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "${1:class} extends ${2:parent}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Define inheritance relationship",
        },
        {
          label: "implements",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "${1:class} implements ${2:interface}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Define implementation relationship",
        },

        // Use case diagram
        {
          label: "usecase",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'usecase "${1:name}"',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Define a use case",
        },

        // Skinparam
        {
          label: "skinparam",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "skinparam ${1:parameter} ${2:value}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Change diagram styling",
        },
        {
          label: "skinparam sequence",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText:
            "skinparam sequence {\n\tArrowColor ${1:DeepSkyBlue}\n\tLifeLineBorderColor ${2:blue}\n\tParticipantBorderColor ${3:DeepSkyBlue}\n\tParticipantBackgroundColor ${4:DodgerBlue}\n\tParticipantFontColor ${5:white}\n}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Set sequence diagram styling",
        },

        // Component diagram
        {
          label: "component",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "component ${1:name}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Define a component",
        },
        {
          label: "database",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "database ${1:name}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Define a database",
        },

        // Common elements
        {
          label: "title",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "title ${1:Diagram Title}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Set diagram title",
        },
        {
          label: "footer",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "footer ${1:footer text}",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: "Add footer to diagram",
        },
      ];

      return { suggestions };
    },
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
