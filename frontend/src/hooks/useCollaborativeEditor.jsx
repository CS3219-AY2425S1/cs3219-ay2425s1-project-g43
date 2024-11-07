import { useEffect, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { yCollab } from "y-codemirror.next";

export const useCollaborativeEditor = ({
  roomName = "default-room",
  wsUrl = "ws://localhost:3006",
  containerId = "editor-container",
}) => {
  const [status, setStatus] = useState("connecting");
  const [editor, setEditor] = useState(null);
  const [provider, setProvider] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState(0);

  useEffect(() => {
    let yDoc, wsProvider, view;

    const initEditor = () => {
      // Initialize Yjs document
      yDoc = new Y.Doc();
      const token = localStorage.getItem("jwtToken");
      // Create WebSocket connection
      wsProvider = new WebsocketProvider(wsUrl, roomName, yDoc, {
        params: { token, roomName },
      });

      // Get the shared text
      const yText = yDoc.getText("codemirror");

      // Create the editor state
      const state = EditorState.create({
        doc: yText.toString(),
        extensions: [
          basicSetup,
          yCollab(yText, wsProvider.awareness),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              // Handle document changes here if needed
            }
          }),
        ],
      });

      // Wait for the container to be available
      const container = document.querySelector(`#${containerId}`);
      if (!container) {
        throw new Error(`Container with id '${containerId}' not found`);
      }

      // Create and mount the editor
      view = new EditorView({
        state,
        parent: container,
      });

      console.log("VIEW");
      console.log(container);

      setEditor(view);
      setProvider(wsProvider);

      // Handle connection status
      wsProvider.on("status", ({ status }) => {
        setStatus(status);
        console.log("Status: ", status);
      });

      // Handle awareness updates
      wsProvider.awareness.on("change", () => {
        setConnectedUsers(wsProvider.awareness.getStates().size);
      });
    };

    try {
      initEditor();
    } catch (error) {
      console.error("Error initializing collaborative editor:", error);
      setStatus("error");
    }

    // Cleanup
    return () => {
      if (view) view.destroy();
      if (wsProvider) wsProvider.destroy();
      if (yDoc) yDoc.destroy();
    };
  }, [roomName, wsUrl, containerId]);

  const getContent = () => {
    return editor?.state.doc.toString() || "";
  };

  const setContent = (content) => {
    if (editor) {
      const transaction = editor.state.update({
        changes: {
          from: 0,
          to: editor.state.doc.length,
          insert: content,
        },
      });
      editor.dispatch(transaction);
    }
  };

  return {
    status,
    editor,
    provider,
    connectedUsers,
    getContent,
    setContent,
  };
};
