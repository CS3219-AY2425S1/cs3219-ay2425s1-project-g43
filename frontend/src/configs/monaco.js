import * as monaco from "monaco-editor";

// Language templates and metadata
export const languages = [
  {
    value: "python",
    label: "Python",
    template:
      'def main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()',
  },
  {
    value: "java",
    label: "Java",
    template:
      'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  },
  {
    value: "javascript",
    label: "JavaScript",
    template:
      'function main() {\n    console.log("Hello, World!");\n}\n\nmain();',
  },
  {
    value: "typescript",
    label: "TypeScript",
    template:
      'function main(): void {\n    console.log("Hello, World!");\n}\n\nmain();',
  },
  {
    value: "c",
    label: "C",
    template:
      '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
  },
  {
    value: "csharp",
    label: "C#",
    template:
      'using System;\n\nclass Program {\n    static void Main(string[] args) {\n        Console.WriteLine("Hello, World!");\n    }\n}',
  },
  {
    value: "cpp",
    label: "C++",
    template:
      '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
  },
];

// Editor default options
export const editorOptions = {
  fontSize: 18,
  lineHeight: 21,
  minimap: { enabled: true },
  renderValidationDecorations: "on",
  semanticValidation: true,
  syntaxValidation: true,
  hover: { enabled: true },
  suggestOnTriggerCharacters: true,
  formatOnType: false,
  formatOnPaste: true,
  lightbulb: { enabled: true },
  quickSuggestions: { other: true, comments: true, strings: true },
  parameterHints: { enabled: true },
  wordBasedSuggestions: true,
  suggest: {
    showKeywords: true,
    showWords: true,
    showFunctions: true,
    showClasses: true,
    showEvents: true,
  },
};

// Theme configuration
monaco.editor.defineTheme("custom-dark", {
  base: "vs-dark",
  inherit: true,
  rules: [
    {
      background: "24292e",
      token: "",
    },
    {
      foreground: "959da5",
      token: "comment",
    },
    {
      foreground: "959da5",
      token: "punctuation.definition.comment",
    },
    {
      foreground: "959da5",
      token: "string.comment",
    },
    {
      foreground: "c8e1ff",
      token: "constant",
    },
    {
      foreground: "c8e1ff",
      token: "entity.name.constant",
    },
    {
      foreground: "c8e1ff",
      token: "variable.other.constant",
    },
    {
      foreground: "c8e1ff",
      token: "variable.language",
    },
    {
      foreground: "b392f0",
      token: "entity",
    },
    {
      foreground: "b392f0",
      token: "entity.name",
    },
    {
      foreground: "f6f8fa",
      token: "variable.parameter.function",
    },
    {
      foreground: "7bcc72",
      token: "entity.name.tag",
    },
    {
      foreground: "ea4a5a",
      token: "keyword",
    },
    {
      foreground: "ea4a5a",
      token: "storage",
    },
    {
      foreground: "ea4a5a",
      token: "storage.type",
    },
    {
      foreground: "f6f8fa",
      token: "storage.modifier.package",
    },
    {
      foreground: "f6f8fa",
      token: "storage.modifier.import",
    },
    {
      foreground: "f6f8fa",
      token: "storage.type.java",
    },
    {
      foreground: "79b8ff",
      token: "string",
    },
    {
      foreground: "79b8ff",
      token: "punctuation.definition.string",
    },
    {
      foreground: "79b8ff",
      token: "string punctuation.section.embedded source",
    },
    {
      foreground: "c8e1ff",
      token: "support",
    },
    {
      foreground: "c8e1ff",
      token: "meta.property-name",
    },
    {
      foreground: "fb8532",
      token: "variable",
    },
    {
      foreground: "f6f8fa",
      token: "variable.other",
    },
    {
      foreground: "d73a49",
      fontStyle: "bold italic underline",
      token: "invalid.broken",
    },
    {
      foreground: "d73a49",
      fontStyle: "bold italic underline",
      token: "invalid.deprecated",
    },
    {
      foreground: "fafbfc",
      background: "d73a49",
      fontStyle: "italic underline",
      token: "invalid.illegal",
    },
    {
      foreground: "fafbfc",
      background: "d73a49",
      fontStyle: "italic underline",
      token: "carriage-return",
    },
    {
      foreground: "d73a49",
      fontStyle: "bold italic underline",
      token: "invalid.unimplemented",
    },
    {
      foreground: "d73a49",
      token: "message.error",
    },
    {
      foreground: "f6f8fa",
      token: "string source",
    },
    {
      foreground: "c8e1ff",
      token: "string variable",
    },
    {
      foreground: "79b8ff",
      token: "source.regexp",
    },
    {
      foreground: "79b8ff",
      token: "string.regexp",
    },
    {
      foreground: "79b8ff",
      token: "string.regexp.character-class",
    },
    {
      foreground: "79b8ff",
      token: "string.regexp constant.character.escape",
    },
    {
      foreground: "79b8ff",
      token: "string.regexp source.ruby.embedded",
    },
    {
      foreground: "79b8ff",
      token: "string.regexp string.regexp.arbitrary-repitition",
    },
    {
      foreground: "7bcc72",
      fontStyle: "bold",
      token: "string.regexp constant.character.escape",
    },
    {
      foreground: "c8e1ff",
      token: "support.constant",
    },
    {
      foreground: "c8e1ff",
      token: "support.variable",
    },
    {
      foreground: "c8e1ff",
      token: "meta.module-reference",
    },
    {
      foreground: "fb8532",
      token: "markup.list",
    },
    {
      foreground: "0366d6",
      fontStyle: "bold",
      token: "markup.heading",
    },
    {
      foreground: "0366d6",
      fontStyle: "bold",
      token: "markup.heading entity.name",
    },
    {
      foreground: "c8e1ff",
      token: "markup.quote",
    },
    {
      foreground: "f6f8fa",
      fontStyle: "italic",
      token: "markup.italic",
    },
    {
      foreground: "f6f8fa",
      fontStyle: "bold",
      token: "markup.bold",
    },
    {
      foreground: "c8e1ff",
      token: "markup.raw",
    },
    {
      foreground: "b31d28",
      background: "ffeef0",
      token: "markup.deleted",
    },
    {
      foreground: "b31d28",
      background: "ffeef0",
      token: "meta.diff.header.from-file",
    },
    {
      foreground: "b31d28",
      background: "ffeef0",
      token: "punctuation.definition.deleted",
    },
    {
      foreground: "176f2c",
      background: "f0fff4",
      token: "markup.inserted",
    },
    {
      foreground: "176f2c",
      background: "f0fff4",
      token: "meta.diff.header.to-file",
    },
    {
      foreground: "176f2c",
      background: "f0fff4",
      token: "punctuation.definition.inserted",
    },
    {
      foreground: "b08800",
      background: "fffdef",
      token: "markup.changed",
    },
    {
      foreground: "b08800",
      background: "fffdef",
      token: "punctuation.definition.changed",
    },
    {
      foreground: "2f363d",
      background: "959da5",
      token: "markup.ignored",
    },
    {
      foreground: "2f363d",
      background: "959da5",
      token: "markup.untracked",
    },
    {
      foreground: "b392f0",
      fontStyle: "bold",
      token: "meta.diff.range",
    },
    {
      foreground: "c8e1ff",
      token: "meta.diff.header",
    },
    {
      foreground: "0366d6",
      fontStyle: "bold",
      token: "meta.separator",
    },
    {
      foreground: "0366d6",
      token: "meta.output",
    },
    {
      foreground: "ffeef0",
      token: "brackethighlighter.tag",
    },
    {
      foreground: "ffeef0",
      token: "brackethighlighter.curly",
    },
    {
      foreground: "ffeef0",
      token: "brackethighlighter.round",
    },
    {
      foreground: "ffeef0",
      token: "brackethighlighter.square",
    },
    {
      foreground: "ffeef0",
      token: "brackethighlighter.angle",
    },
    {
      foreground: "ffeef0",
      token: "brackethighlighter.quote",
    },
    {
      foreground: "d73a49",
      token: "brackethighlighter.unmatched",
    },
    {
      foreground: "d73a49",
      token: "sublimelinter.mark.error",
    },
    {
      foreground: "fb8532",
      token: "sublimelinter.mark.warning",
    },
    {
      foreground: "6a737d",
      token: "sublimelinter.gutter-mark",
    },
    {
      foreground: "79b8ff",
      fontStyle: "underline",
      token: "constant.other.reference.link",
    },
    {
      foreground: "79b8ff",
      fontStyle: "underline",
      token: "string.other.link",
    },
  ],
  colors: {
    "editor.foreground": "#f6f8fa",
    "editor.background": "#24292e",
    "editor.selectionBackground": "#4c2889",
    "editor.inactiveSelectionBackground": "#444d56",
    "editor.lineHighlightBackground": "#444d56",
    "editorCursor.foreground": "#ffffff",
    "editorWhitespace.foreground": "#6a737d",
    "editorIndentGuide.background": "#6a737d",
    "editorIndentGuide.activeBackground": "#f6f8fa",
    "editor.selectionHighlightBorder": "#444d56",
  },
});

export const editorDefaultOptions = {
  theme: "custom-dark",
  ...editorOptions,
};
