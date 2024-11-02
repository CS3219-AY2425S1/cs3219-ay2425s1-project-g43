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

export const editorOptions = {
  fontSize: 14,
  lineHeight: 21,
  minimap: { enabled: true },
  renderValidationDecorations: "off",
  semanticValidation: true,
  syntaxValidation: true,
  hover: { enabled: true },
  suggestOnTriggerCharacters: true,
  formatOnType: true,
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
