import { useEffect, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import * as monaco from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import { languages } from "../configs/editor";

export const useCollaborativeEditor = ({
  roomName = "default-room",
  wsUrl = "ws://localhost:3006",
  containerId = "editor-container",
  defaultLanguage = "python",
}) => {
  const [status, setStatus] = useState("connecting");
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [editor, setEditor] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    let yDoc, wsProvider, monacoEditor;

    const initializeEditor = () => {
      // Initialize Yjs document and WebSocket provider
      yDoc = new Y.Doc();
      wsProvider = new WebsocketProvider(wsUrl, roomName, yDoc);

      const yText = yDoc.getText("monaco");

      // Find the container
      const container = document.getElementById(containerId);
      if (!container) {
        throw new Error(`Container with id '${containerId}' not found`);
      }

      // Create the Monaco Editor instance
      monacoEditor = monaco.editor.create(container, {
        theme: "vs-dark",
      });

      // Bind Yjs to Monaco
      new MonacoBinding(
        yText,
        monacoEditor.getModel(),
        new Set([monacoEditor]),
        wsProvider.awareness,
      );

      setEditor(monacoEditor);
      setProvider(wsProvider);

      const initialTemplate =
        languages.find((lang) => lang.value === defaultLanguage)?.template ||
        "";
      monacoEditor.getModel().setValue(initialTemplate);

      monaco.editor.setModelLanguage(monacoEditor.getModel(), defaultLanguage);

      // Handle connection status
      wsProvider.on("status", ({ status }) => setStatus(status));
      wsProvider.awareness.on("change", () => {
        setConnectedUsers(wsProvider.awareness.getStates().size);
      });
    };

    try {
      initializeEditor();
    } catch (error) {
      console.error("Error initializing collaborative editor:", error);
      setStatus("error");
    }

    // Cleanup
    return () => {
      if (monacoEditor) monacoEditor.dispose();
      if (wsProvider) wsProvider.destroy();
      if (yDoc) yDoc.destroy();
    };
  }, [roomName, wsUrl, containerId, defaultLanguage]);

  const updateLanguage = (newLanguage) => {
    if (editor) {
      monaco.editor.setModelLanguage(editor.getModel(), newLanguage);
    }
  };

  const getContent = () => editor?.getModel().getValue() || "";
  const setContent = (content) => {
    if (editor) {
      editor.getModel().setValue(content);
    }
  };

  return {
    status,
    editor,
    provider,
    connectedUsers,
    getContent,
    setContent,
    updateLanguage,
  };
};
