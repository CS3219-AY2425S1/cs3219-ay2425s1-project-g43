import { useEffect, useState, useRef } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import * as monaco from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import { languages, editorDefaultOptions } from "../configs/monaco";
import "../configs/monaco";

export const useCollaborativeEditor = ({
  roomName = "default-room",
  wsUrl = "ws://localhost:3006",
  containerId = "editor-container",
  defaultLanguage = "python",
  theme = "vs-dark",
}) => {
  const [status, setStatus] = useState("connecting");
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [editor, setEditor] = useState(null);
  const [provider, setProvider] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);

  const getTemplateForLanguage = (language) => {
    return languages.find((lang) => lang.value === language)?.template || "";
  };

  useEffect(() => {
    let yDoc = new Y.Doc();
    let wsProvider = new WebsocketProvider(wsUrl, roomName, yDoc);
    let yText = yDoc.getText("content");
    let yLanguage = yDoc.getMap("language");

    setProvider(wsProvider);

    // Initialize yLanguage
    if (!yLanguage.get("selectedLanguage")) {
      yLanguage.set("selectedLanguage", defaultLanguage);
    }

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
      automaticLayout: true,
    });

    setEditor(monacoEditor);

    // Add template handling
    wsProvider.on("synced", (isSynced) => {
      if (isSynced && !yText.toString()) {
        const template = getTemplateForLanguage(
          yLanguage.get("selectedLanguage") || defaultLanguage,
        );
        yText.insert(0, template);
      }
    });

    // Set up Monaco binding
    new MonacoBinding(
      yText,
      monacoEditor.getModel(),
      new Set([monacoEditor]),
      wsProvider.awareness,
    );

    // Handle connection status
    wsProvider.on("status", ({ status }) => {
      console.log("WebSocket status:", status);
      setStatus(status);
    });

    // Handle language changes
    yLanguage.observe(() => {
      const newLanguage = yLanguage.get("selectedLanguage");
      if (newLanguage && newLanguage !== currentLanguage) {
        setCurrentLanguage(newLanguage);
        monaco.editor.setModelLanguage(monacoEditor.getModel(), newLanguage);
      }
    });

    // Cleanup
    return () => {
      if (monacoEditor) {
        monacoEditor.dispose();
      }
      if (wsProvider) {
        wsProvider.destroy();
      }
      if (yDoc) {
        yDoc.destroy();
      }
    };
  }, [roomName, wsUrl, containerId, theme, defaultLanguage]);

  const getContent = () => editor?.getModel()?.getValue() || "";

  const setContent = (content) => {
    if (editor) {
      editor.getModel()?.setValue(content);
    }
  };

  const updateLanguage = (newLanguage) => {
    if (provider) {
      const yLanguage = provider.doc.getMap("language");
      const yText = provider.doc.getText("content");

      // Update the language
      yLanguage.set("selectedLanguage", newLanguage);

      // Update the content with new template
      const template = getTemplateForLanguage(newLanguage);
      yText.delete(0, yText.length);
      yText.insert(0, template);
    }
  };

  const changeTheme = (newTheme) => {
    monaco.editor.setTheme(newTheme);
  };

  return {
    status,
    editor,
    provider,
    connectedUsers,
    getContent,
    setContent,
    updateLanguage,
    currentLanguage,
    changeTheme,
  };
};
