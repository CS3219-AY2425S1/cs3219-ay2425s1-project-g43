import { useEffect, useState, useRef } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import * as monaco from "monaco-editor";
import { MonacoBinding } from "y-monaco";
import { languages, editorDefaultOptions } from "../configs/monaco";
import "../configs/monaco";

const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
};

export const useCollaborativeEditor = ({
  roomName = "default-room",
  wsUrl = "ws://localhost:3006",
  containerId = "editor-container",
  defaultLanguage = "python",
  theme = "vs-dark",
  user,
  question,
}) => {
  if (!user) {
    const randomName = `Anonymous-${Math.random().toString(36).substring(2, 5)}`;
    user = {
      name: randomName,
      color: `#${Math.abs(hashCode(randomName)).toString(16).substring(0, 6)}`,
    };
  }

  const [status, setStatus] = useState("connecting");
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [editor, setEditor] = useState(null);
  const [provider, setProvider] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);

  const decorationCollection = useRef(null);
  const awarenessRef = useRef(null);

  const getTemplateForLanguage = (language) => {
    return languages.find((lang) => lang.value === language)?.template || "";
  };

  useEffect(() => {
    const questionString = JSON.stringify(question);
    let yDoc = new Y.Doc();
    const token = localStorage.getItem("jwtToken");
    // Create WebSocket connection
    const wsProvider = new WebsocketProvider(wsUrl, roomName, yDoc, {
      params: { token, roomName, questionString },
    });

    console.log("NEW WS PROVIDER");
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

    // Initialize decoration collection after editor is created
    decorationCollection.current = monacoEditor.createDecorationsCollection();

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

    // Set up awareness
    const awareness = wsProvider.awareness;
    awarenessRef.current = awareness;

    // Update awareness state with user info and cursor
    awareness.setLocalState({
      user,
      cursor: monacoEditor.getPosition(),
    });

    // Handle cursor position changes
    monacoEditor.onDidChangeCursorPosition((e) => {
      const state = awareness.getLocalState();
      if (state) {
        awareness.setLocalState({
          ...state,
          cursor: e.position,
        });
      }
    });

    // Handle remote cursors
    awareness.on("change", () => {
      const states = Array.from(awareness.getStates().values());
      setConnectedUsers(states.length);

      const decorations = [];
      states.forEach((state) => {
        if (!state.user || state.user.name === user.name) return;

        if (state.cursor) {
          decorations.push({
            range: new monaco.Range(
              state.cursor.lineNumber,
              state.cursor.column,
              state.cursor.lineNumber,
              state.cursor.column,
            ),
            options: {
              className: "remote-cursor",
              hoverMessage: [
                {
                  value: state.user.name,
                  isTrusted: true,
                },
              ],
              stickiness:
                monaco.editor.TrackedRangeStickiness
                  .NeverGrowsWhenTypingAtEdges,
              inlineClassName: "remote-cursor",
              inlineClassNameAffectsLetterSpacing: true,
              inlineClassNameStyle: {
                "--cursor-color": state.user.color || "#9333ea",
              },
            },
          });
        }
      });

      decorationCollection.current.set(decorations);
    });

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
      if (decorationCollection.current) {
        decorationCollection.current.clear();
      }
      if (monacoEditor) {
        monacoEditor.dispose();
      }
      if (wsProvider) {
        wsProvider.awareness.setLocalState(null);
        wsProvider.emit("leave", yDoc.getText("content").toString());
        wsProvider.destroy();
      }
      if (yDoc) {
        yDoc.destroy();
      }
    };
  }, [roomName, wsUrl, containerId, user]);

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
