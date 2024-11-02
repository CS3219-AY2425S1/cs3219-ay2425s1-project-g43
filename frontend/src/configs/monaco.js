import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

self.MonacoEnvironment = {
  getWorker(_, label) {
    return new editorWorker();
  },
};

monaco.editor.defineTheme("custom-dark", {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "keyword", foreground: "#C586C0", fontStyle: "bold" },
    { token: "type", foreground: "#4EC9B0" },
    { token: "identifier", foreground: "#9CDCFE" },
    { token: "string", foreground: "#CE9178" },
    { token: "string.escape", foreground: "#D7BA7D" },
    { token: "number", foreground: "#B5CEA8" },
    { token: "comment", foreground: "#6A9955", fontStyle: "italic" },
    { token: "operator", foreground: "#D4D4D4" },
    { token: "delimiter", foreground: "#D4D4D4" },
    { token: "delimiter.bracket", foreground: "#FFD700" },
    { token: "variable.parameter", foreground: "#9CDCFE" },
    { token: "function", foreground: "#DCDCAA" },
    { token: "preprocessor", foreground: "#C586C0" },
  ],
  colors: {
    "editor.background": "#1E1E1E",
    "editor.lineHighlightBackground": "#2D2D2D",
    "editor.selectionBackground": "#264F78",
    "editorCursor.foreground": "#FFFFFF",
    "editorIndentGuide.activeBackground": "#707070",
    "editorIndentGuide.background": "#404040",
  },
});


const editorDefaultOptions = {
  theme: "custom-dark",
  fontSize: 14,
  lineHeight: 21,
  minimap: { enabled: false },
  padding: { top: 10 },
  smoothScrolling: true,
  cursorBlinking: "smooth",
  cursorSmoothCaretAnimation: true,
  tabSize: 2,
  bracketPairColorization: { enabled: true },
  guides: {
    bracketPairs: true,
    indentation: true,
  },
  renderLineHighlight: "all",
};


const createLanguageConfig = (languageSpecific = {}) => ({
  defaultToken: "invalid",
  tokenizer: {
    root: [
      // Keywords
      [
        /\b(if|else|while|for|return|function|class|import|export|from|const|let|var)\b/,
        "keyword",
      ],
      [
        new RegExp(`\\b(${languageSpecific.keywords?.join("|") || ""})\\b`),
        "keyword",
      ],
      // Strings
      [/"([^"\\]|\\.)*$/, "string.invalid"], // Bad string
      [/'([^'\\]|\\.)*$/, "string.invalid"], // Bad string
      [/"/, "string", "@string_double"],
      [/'/, "string", "@string_single"],
      [/`/, "string", "@string_backtick"],

      // Comments
      [/\/\/.*$/, "comment"],
      [/\/\*/, "comment", "@comment"],

      // Numbers
      [/\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
      [/0[xX][0-9a-fA-F]+/, "number.hex"],
      [/\d+/, "number"],

      // Identifiers
      [/[a-zA-Z_]\w*/, { cases: { "@default": "identifier" } }],

      // Operators
      [/[=><!~?:&|+\-*/^%]+/, "operator"],

      // Brackets
      [/[{}()[\]]/, "@brackets"],

      // Delimiters
      [/[;,.]/, "delimiter"],
    ],
    string_double: [
      [/[^\\"]+/, "string"],
      [/\\./, "string.escape"],
      [/"/, "string", "@pop"],
    ],
    string_single: [
      [/[^\\']+/, "string"],
      [/\\./, "string.escape"],
      [/'/, "string", "@pop"],
    ],
    string_backtick: [
      [/\$\{/, { token: "delimiter.bracket", next: "@bracketCounting" }],
      [/[^\\`$]+/, "string"],
      [/\\./, "string.escape"],
      [/`/, "string", "@pop"],
    ],
    bracketCounting: [
      [/\{/, "delimiter.bracket", "@bracketCounting"],
      [/\}/, "delimiter.bracket", "@pop"],
      { include: "root" },
    ],
    comment: [
      [/[^/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[/*]/, "comment"],
    ],
  },
});

// Language-specific configurations
const languageConfigs = {
  python: {
    keywords: [
      "and",
      "as",
      "assert",
      "async",
      "await",
      "break",
      "class",
      "continue",
      "def",
      "del",
      "elif",
      "else",
      "except",
      "finally",
      "for",
      "from",
      "global",
      "if",
      "import",
      "in",
      "is",
      "lambda",
      "nonlocal",
      "not",
      "or",
      "pass",
      "raise",
      "return",
      "try",
      "while",
      "with",
      "yield",
    ],
  },
  java: {
    keywords: [
      "abstract",
      "assert",
      "boolean",
      "break",
      "byte",
      "case",
      "catch",
      "char",
      "class",
      "const",
      "continue",
      "default",
      "do",
      "double",
      "else",
      "enum",
      "extends",
      "final",
      "finally",
      "float",
      "for",
      "if",
      "implements",
      "import",
      "instanceof",
      "int",
      "interface",
      "long",
      "native",
      "new",
      "package",
      "private",
      "protected",
      "public",
      "return",
      "short",
      "static",
      "strictfp",
      "super",
      "switch",
      "synchronized",
      "this",
      "throw",
      "throws",
      "transient",
      "try",
      "void",
      "volatile",
      "while",
    ],
  },
  cpp: {
    keywords: [
      "auto",
      "break",
      "case",
      "char",
      "const",
      "continue",
      "default",
      "do",
      "double",
      "else",
      "enum",
      "extern",
      "float",
      "for",
      "goto",
      "if",
      "int",
      "long",
      "register",
      "return",
      "short",
      "signed",
      "sizeof",
      "static",
      "struct",
      "switch",
      "typedef",
      "union",
      "unsigned",
      "void",
      "volatile",
      "while",
      "class",
      "namespace",
      "template",
      "virtual",
      "public",
      "protected",
      "private",
    ],
  },
};

Object.entries(languageConfigs).forEach(([lang, config]) => {
  monaco.languages.register({ id: lang });
  monaco.languages.setMonarchTokensProvider(lang, createLanguageConfig(config));
});

export { editorDefaultOptions };
