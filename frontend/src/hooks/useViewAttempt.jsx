import { useEffect, useState } from "react";
import * as monaco from "monaco-editor";
import { languages, editorDefaultOptions } from "../configs/monaco";
import "../configs/monaco";

export const useViewAttempt = ({
  containerId = "editor-container",
  defaultLanguage = "python",
  theme = "vs-dark",
  initialContent = "",
}) => {
  const [editor, setEditor] = useState(null);

  const getTemplateForLanguage = (language) => {
    return languages.find((lang) => lang.value === language)?.template || "";
  };

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with id '${containerId}' not found`);
      return;
    }

    // Create editor with default options
    const monacoEditor = monaco.editor.create(container, {
      ...editorDefaultOptions,
      theme,
      language: defaultLanguage,
      value: initialContent || getTemplateForLanguage(defaultLanguage),
      automaticLayout: true,
      readOnly: true,
    });

    setEditor(monacoEditor);

    // Cleanup function
    return () => {
      if (monacoEditor) {
        monacoEditor.dispose();
      }
    };
  }, [containerId, defaultLanguage, theme, initialContent]);

  const getContent = () => editor?.getModel()?.getValue() || "";

  const changeTheme = (newTheme) => {
    if (editor) {
      monaco.editor.setTheme(newTheme);
    }
  };

  return {
    getContent,
    changeTheme,
  };
};
