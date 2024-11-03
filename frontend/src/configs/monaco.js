import * as monaco from "monaco-editor";
import monokaiTheme from "monaco-themes/themes/Monokai.json";
import draculaTheme from "monaco-themes/themes/Dracula.json";
import githubLightTheme from "monaco-themes/themes/GitHub Light.json";
import githubDarkTheme from "monaco-themes/themes/GitHub Dark.json";
import merbivore from "monaco-themes/themes/Merbivore.json";
import nightOwl from "monaco-themes/themes/Night Owl.json";
import solarizedLight from "monaco-themes/themes/Solarized-light.json";
import tomorrowNight from "monaco-themes/themes/Tomorrow-Night-Bright.json";
import vibrantInk from "monaco-themes/themes/Vibrant Ink.json";
import amy from "monaco-themes/themes/Amy.json";
import cobalt from "monaco-themes/themes/Cobalt.json";

self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === "typescript" || label === "javascript") {
      return "/monaco/language/typescript/tsWorker.js";
    }
    if (label === "json") {
      return "/monaco/language/json/json.worker.js";
    }
    if (label === "css") {
      return "/monaco/language/css/css.worker.js";
    }
    if (label === "html") {
      return "/monaco/language/html/html.worker.js";
    }
    return "/monaco/editor/editor.main.js";
  },
};

export const languages = [
  {
    value: "python",
    label: "Python",
    template:
      '# Here is a starter template:\n\ndef main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()',
  },
  {
    value: "java",
    label: "Java",
    template:
      '// Here is a starter template:\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  },
  {
    value: "javascript",
    label: "JavaScript",
    template:
      '// Here is a starter template:\n\nfunction main() {\n    console.log("Hello, World!");\n}\n\nmain();',
  },
  {
    value: "typescript",
    label: "TypeScript",
    template:
      '// Here is a starter template:\n\nfunction main(): void {\n    console.log("Hello, World!");\n}\n\nmain();',
  },
  {
    value: "c",
    label: "C",
    template:
      '// Here is a starter template:\n\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
  },
  {
    value: "csharp",
    label: "C#",
    template:
      '// Here is a starter template:\n\nusing System;\n\nclass Program {\n    static void Main(string[] args) {\n        Console.WriteLine("Hello, World!");\n    }\n}',
  },
  {
    value: "cpp",
    label: "C++",
    template:
      '// Here is a starter template:\n\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
  },
];

// Editor default options
export const editorOptions = {
  fontSize: 14,
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

// theme
monaco.editor.defineTheme("monokai", monokaiTheme);
monaco.editor.defineTheme("dracula", draculaTheme);
monaco.editor.defineTheme("github-light", githubLightTheme);
monaco.editor.defineTheme("github-dark", githubDarkTheme);
monaco.editor.defineTheme("merbivore", merbivore);
monaco.editor.defineTheme("night-owl", nightOwl);
monaco.editor.defineTheme("solarized-light", solarizedLight);
monaco.editor.defineTheme("tomorrow-night", tomorrowNight);
monaco.editor.defineTheme("vibrant-ink", vibrantInk);
monaco.editor.defineTheme("amy", amy);
monaco.editor.defineTheme("cobalt", cobalt);

export const themeOptions = [
  { value: "vs-dark", label: "VS Dark" },
  { value: "vs", label: "VS Light" },
  { value: "hc-black", label: "VS High Contrast" },
  { value: "monokai", label: "Monokai" },
  { value: "dracula", label: "Dracula" },
  { value: "github-light", label: "GitHub Light" },
  { value: "github-dark", label: "GitHub Dark" },
  { value: "merbivore", label: "Merbivore" },
  { value: "night-owl", label: "Night Owl" },
  { value: "solarized-light", label: "Solarized Light" },
  { value: "tomorrow-night", label: "Tomorrow Night" },
  { value: "vibrant-ink", label: "Vibrant Ink" },
  { value: "amy", label: "Amy" },
  { value: "cobalt", label: "Cobalt" },
];

export const editorDefaultOptions = {
  ...editorOptions,
};
