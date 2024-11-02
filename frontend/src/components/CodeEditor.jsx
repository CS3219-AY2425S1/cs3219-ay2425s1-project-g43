import React, { useState, useEffect } from "react";
import { useCollaborativeEditor } from "../hooks/useCollaborativeEditor";
import Button from "../components/Button";
import Select from "../components/Select";
import Output from "../components/Output";
import { languages, editorDefaultOptions } from "../configs/monaco";
import { executePistonCode } from "../services/CollaborationService";
import { useLocation } from "react-router-dom";
import { Play, Loader } from "lucide-react";

const collaborationServiceBaseUrl = import.meta.env
  .VITE_COLLABORATION_SERVICE_BASEURL;

export default function CodeEditor() {
  // Define localLanguage and setLocalLanguage
  const [localLanguage, setLocalLanguage] = useState("python"); // Default language as "python"
  const [output, setOutput] = useState({
    type: "initial",
    content: "No output yet",
  });
  const [isExecuting, setIsExecuting] = useState(false);

  const location = useLocation();
  const roomName = location.pathname.split("/").pop();

  // Using the custom hook with synchronization capabilities
  const {
    status,
    connectedUsers,
    getContent,
    setContent,
    updateLanguage,
    currentLanguage, // New: Get the shared language state
  } = useCollaborativeEditor({
    roomName,
    wsUrl: collaborationServiceBaseUrl || "ws://localhost:6006",
    containerId: "editor-container",
    defaultLanguage: localLanguage,
  });

  // Sync local language state with shared language state
  useEffect(() => {
    if (currentLanguage && currentLanguage !== localLanguage) {
      setLocalLanguage(currentLanguage);
    }
  }, [currentLanguage]);

  const handleRun = async () => {
    setIsExecuting(true);
    setOutput({ type: "running", content: "Executing code..." });

    try {
      const code = getContent();
      const result = await executePistonCode(localLanguage, code);

      if (result.success) {
        setOutput({ type: "success", content: result.output });
      } else {
        const errorPrefix =
          result.errorType === "compilation"
            ? "⚠️ Compilation Error:\n"
            : result.errorType === "runtime"
              ? "❌ Runtime Error:\n"
              : "⚠️ System Error:\n";
        setOutput({ type: "error", content: errorPrefix + result.error });
      }
    } catch (error) {
      setOutput({
        type: "error",
        content: "⚠️ System Error:\n" + error.message,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLocalLanguage(newLanguage); // Update local state
    updateLanguage(newLanguage); // Update shared state
  };

  return (
    <div className="flex flex-col space-y-4 rounded-lg border border-gray-300/30 p-6">
      <Header status={status} connectedUsers={connectedUsers} />

      <div className="mb-4 flex flex-wrap items-start gap-4">
        <Select
          value={localLanguage}
          onChange={handleLanguageChange}
          options={languages}
        />
        <Button
          onClick={handleRun}
          disabled={isExecuting}
          icon={isExecuting ? Loader : Play}
        >
          {isExecuting ? "Running..." : "Run"}
        </Button>
      </div>

      <div
        id="editor-container"
        className="h-[400px] w-full overflow-hidden rounded-lg border border-gray-700/30 bg-[#1e1e1e] "
      />

      <Output output={output} />
    </div>
  );
}

function Header({ status, connectedUsers }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="text-L mb-2 font-bold text-[#bcfe4d]">CODE EDITOR</div>
      <div className="flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${
            status === "connected" ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="text-sm text-gray-400">
          {status === "connected"
            ? `${connectedUsers} user${connectedUsers !== 1 ? "s" : ""} connected`
            : "Disconnected"}
        </span>
      </div>
    </div>
  );
}
