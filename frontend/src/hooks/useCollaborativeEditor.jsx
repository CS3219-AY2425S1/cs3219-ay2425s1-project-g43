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
  wsUrl = "ws://localhost:6006",
  containerId = "editor-container",
  defaultLanguage = "python",
  theme = "vs-dark",
  user = {
    name: `User-${Math.random().toString(36).from(2, 5)}`,
    color: `#${Math.abs(hashCode(user.name)).toString(16).substring(0, 6)}`,
  },
}) => {
  const [status, setStatus] = useState("connecting");
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [initialTemplate, setInitialTemplate] = useState("");
  const [editor, setEditor] = useState(null);
  const [provider, setProvider] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const pendingLanguage = useRef(null);
  const decorationsRef = useRef([]);
  const awarenessRef = useRef(null);
  const isUpdatingRef = useRef(false);
  const pendingUpdateRef = useRef(null);

  useEffect(() => {
    let yDoc, wsProvider, monacoEditor, yText, yLanguage;

    // for different cursors
    const updateDecorations = (states) => {
      if (!monacoEditor || isUpdatingRef.current) {
        pendingUpdateRef.current = states; // Store pending states to process later
        return;
      }

      try {
        isUpdatingRef.current = true; 
        const decorationArray = [];

        states.forEach((state) => {
          const isLocalUser = state.user.name === user.name;
          const userColor = state.user.color || "#000000";

          if (!state.user || state.user.name === user.name) return;

          if (state.cursor || isLocalUser) {
            decorationArray.push({
              range: new monaco.Range(
                state.cursor?.lineNumber ||
                  monacoEditor.getPosition().lineNumber,
                state.cursor?.column || monacoEditor.getPosition().column,
                state.cursor?.lineNumber ||
                  monacoEditor.getPosition().lineNumber,
                state.cursor?.column || monacoEditor.getPosition().column,
              ),
              options: {
                className: `remote-cursor`,
                beforeContentClassName: `cursor-tooltip`,
                beforeContent: {
                  content: state.user.name,
                },
                beforeContentStyle: {
                  color: "white",
                  backgroundColor: userColor,
                },
                inlineClassName: `remote-cursor`,
                inlineClassNameAffectsLetterSpacing: true,
                inlineClassNameStyle: {
                  "--cursor-color": userColor,
                },
              },
            });
          }

          if (state.selection && !isLocalUser) {
            decorationArray.push({
              range: new monaco.Range(
                state.selection.startLineNumber,
                state.selection.startColumn,
                state.selection.endLineNumber,
                state.selection.endColumn,
              ),
              options: {
                className: `remote-selection`,
                inlineClassName: `remote-selection`,
                inlineClassNameAffectsLetterSpacing: true,
                inlineClassNameStyle: {
                  "--selection-color": userColor,
                },
              },
            });
          }
        });

        decorationsRef.current = monacoEditor.deltaDecorations(
          decorationsRef.current,
          decorationArray,
        );
      } finally {
        isUpdatingRef.current = false;

        // Process any pending update after the current one completes
        if (pendingUpdateRef.current) {
          const pendingStates = pendingUpdateRef.current;
          pendingUpdateRef.current = null; // Clear pending updates
          setTimeout(() => updateDecorations(pendingStates), 0); // Call again to process pending
        }
      }
    };

    // intialize the editor
    const initializeEditor = () => {
      yDoc = new Y.Doc();
      wsProvider = new WebsocketProvider(wsUrl, roomName, yDoc, {
        reconnect: true,
      });

      setProvider(wsProvider);

      yText = yDoc.getText("sharedCode");
      yLanguage = yDoc.getMap("language");

      if (!yLanguage.has("selectedLanguage")) {
        yLanguage.set("selectedLanguage", defaultLanguage);
      }

      const container = document.getElementById(containerId);
      if (!container) {
        throw new Error(`Container with id '${containerId}' not found`);
      }

      const awareness = wsProvider.awareness;
      awarenessRef.current = awareness;

      // Debounce the connected users update
      const handleAwarenessChange = () => {
        const states = Array.from(awareness.getStates().values());
        setConnectedUsers(states.length);

        if (!monacoEditor) return;

        const decorationArray = [];
        states.forEach((state) => {
          if (!state.user || state.user.name === user.name) return;

          if (state.cursor) {
            decorationArray.push({
              range: new monaco.Range(
                state.cursor.lineNumber,
                state.cursor.column,
                state.cursor.lineNumber,
                state.cursor.column,
              ),
              options: {
                className: `remote-cursor`,
                beforeContentClassName: `cursor-badge background-${state.user.color.replace("#", "")}`,
                beforeContent: {
                  content: `${state.user.name}`,
                },
              },
            });
          }

          if (state.selection) {
            decorationArray.push({
              range: new monaco.Range(
                state.selection.startLineNumber,
                state.selection.startColumn,
                state.selection.endLineNumber,
                state.selection.endColumn,
              ),
              options: {
                className: `remote-selection background-${state.user.color.replace("#", "")}`,
              },
            });
          }
        });

        decorationsRef.current = monacoEditor.deltaDecorations(
          decorationsRef.current,
          decorationArray,
        );
      };

      awareness.on("change", handleAwarenessChange);

      // Create the Monaco Editor instance
      monacoEditor = monaco.editor.create(container, {
        ...editorDefaultOptions,
        theme,
        language: yLanguage.get("selectedLanguage"),
        automaticLayout: true,
      });

      // Add cursor position change handler
      const handleCursorChange = (e) => {
        if (!awareness) return;
        const localState = awareness.getLocalState() || {};
        awareness.setLocalState({
          ...localState,
          user,
          cursor: e.position,
        });
      };

      // Add selection change handler
      const handleSelectionChange = (e) => {
        if (!awareness) return;
        const localState = awareness.getLocalState() || {};
        awareness.setLocalState({
          ...localState,
          user,
          selection: e.selection,
        });
      };

      monacoEditor.onDidChangeCursorPosition(handleCursorChange);
      monacoEditor.onDidChangeCursorSelection(handleSelectionChange);

      // Set initial awareness state
      awareness.setLocalState({
        user,
        cursor: monacoEditor.getPosition() || undefined,
        selection: monacoEditor.getSelection() || undefined,
      });

      setEditor(monacoEditor);

      new MonacoBinding(
        yText,
        monacoEditor.getModel(),
        new Set([monacoEditor]),
        awareness,
      );

      wsProvider.on("status", ({ status }) => setStatus(status));

      wsProvider.on("synced", (isSynced) => {
        if (isSynced && !yText.length) {
          const template = getTemplateForLanguage(
            yLanguage.get("selectedLanguage"),
          );
          yText.insert(0, template);
          setInitialTemplate(template);
        }
      });

      yLanguage.observe(() => {
        const newLanguage = yLanguage.get("selectedLanguage");
        if (newLanguage && newLanguage !== currentLanguage) {
          setCurrentLanguage(newLanguage);
          monaco.editor.setModelLanguage(monacoEditor.getModel(), newLanguage);

          const currentContent = monacoEditor.getModel().getValue();
          if (currentContent === initialTemplate) {
            const newTemplate = getTemplateForLanguage(newLanguage);
            yText.delete(0, yText.length);
            yText.insert(0, newTemplate);
            setInitialTemplate(newTemplate);
          }
        }
      });
    };

    try {
      initializeEditor();
    } catch (error) {
      console.error("Error initializing collaborative editor:", error);
      setStatus("error");
    }

    return () => {
      if (monacoEditor) {
        isUpdatingRef.current = true; // Prevent any further updates
        decorationsRef.current = monacoEditor.deltaDecorations(
          decorationsRef.current,
          [],
        );
        monacoEditor.dispose();
      }
      if (wsProvider) {
        wsProvider.awareness.setLocalState(null);
        wsProvider.destroy();
      }
      if (yDoc) yDoc.destroy();
    };
  }, [roomName, wsUrl, containerId, theme, defaultLanguage]); // do not add any other dependency, otherwise the cursor won't work

  const changeTheme = (newTheme) => {
    monaco.editor.setTheme(newTheme);
  };

  const getTemplateForLanguage = (language) => {
    return languages.find((lang) => lang.value === language)?.template || "";
  };

  const updateLanguage = (newLanguage) => {
    if (provider) {
      const yLanguage = provider.doc.getMap("language");
      yLanguage.set("selectedLanguage", newLanguage);
    } else {
      pendingLanguage.current = newLanguage;
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
    currentLanguage,
    changeTheme,
  };
};
