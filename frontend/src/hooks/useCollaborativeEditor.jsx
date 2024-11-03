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
  const [initialTemplate, setInitialTemplate] = useState("");
  const [editor, setEditor] = useState(null);
  const [provider, setProvider] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);
  const pendingLanguage = useRef(null);

  useEffect(() => {
    let yDoc, wsProvider, monacoEditor, yText, yLanguage;

    const initializeEditor = () => {
      // Initialize Yjs document and WebSocket provider
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
      awareness.on("change", () => {
        setConnectedUsers(awareness.getStates().size);
      });

      // Create the Monaco Editor instance
      monacoEditor = monaco.editor.create(container, {
        ...editorDefaultOptions,
        theme,
        language: yLanguage.get("selectedLanguage"),
        automaticLayout: true,
      });

      setEditor(monacoEditor);

      // Bind Yjs text to the Monaco model
      new MonacoBinding(
        yText,
        monacoEditor.getModel(),
        new Set([monacoEditor]),
        wsProvider.awareness,
      );

      // Track connection status
      wsProvider.on("status", ({ status }) => setStatus(status));

      // Insert initial template after syncing with the server
      wsProvider.on("synced", (isSynced) => {
        if (isSynced && !yText.length) {
          const template = getTemplateForLanguage(
            yLanguage.get("selectedLanguage"),
          );
          yText.insert(0, template);
          setInitialTemplate(template); // Set initial template for comparison
        }
      });

      // Observe language changes in Yjs to sync language state
       yLanguage.observe(() => {
         const newLanguage = yLanguage.get("selectedLanguage");
         if (newLanguage && newLanguage !== currentLanguage) {
           setCurrentLanguage(newLanguage);
           monaco.editor.setModelLanguage(monacoEditor.getModel(), newLanguage);

           // Update the template if the content is unchanged
           const currentContent = monacoEditor.getModel().getValue();
           if (currentContent === initialTemplate) {
             const newTemplate = getTemplateForLanguage(newLanguage);
             yText.delete(0, yText.length); // Clear current content
             yText.insert(0, newTemplate); // Insert new language template
             setInitialTemplate(newTemplate); // Update initial template for future comparison
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

    // Cleanup on component unmount
    return () => {
      if (monacoEditor) monacoEditor.dispose();
      if (wsProvider) wsProvider.destroy();
      if (yDoc) yDoc.destroy();
    };
  }, [roomName, wsUrl, containerId, theme, defaultLanguage]);

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
