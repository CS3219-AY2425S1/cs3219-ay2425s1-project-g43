import React, { useState, useEffect } from "react";
import { useCollaborativeEditor } from "../hooks/useCollaborativeEditor";
import Button from "../components/Button";
import Select from "../components/Select";
import Output from "../components/Output";
import { languages } from "../configs/monaco";
import { executePistonCode } from "../services/CollaborationService";
import { useLocation } from "react-router-dom";
import { Play, Loader } from "lucide-react";
import ThemeSelector from "./ThemeSelector";

const collaborationServiceBaseUrl = import.meta.env
  .VITE_COLLABORATION_SERVICE_BASEURL;

export default function CodeEditor() {
  const [localLanguage, setLocalLanguage] = useState("python");
  const [theme, setTheme] = useState("vs-dark");
  const [output, setOutput] = useState({
    type: "initial",
    content: "No output yet",
  });
  const [isExecuting, setIsExecuting] = useState(false);

  const location = useLocation();
  const roomName = location.pathname.split("/").pop();

  const user = {
    name: `User-${Math.random()}`,
    color: "#" + Math.floor(Math.random() * 16777215).toString(16),
  };

  // Using the custom useCollaborativeEditor hook
  const {
    status,
    connectedUsers,
    getContent,
    setContent,
    updateLanguage,
    changeTheme,
    currentLanguage,
  } = useCollaborativeEditor({
    roomName,
    wsUrl: collaborationServiceBaseUrl || "ws://localhost:6006",
    containerId: "editor-container",
    defaultLanguage: localLanguage,
    theme,
    user,
  });

  useEffect(() => {
    if (currentLanguage && currentLanguage !== localLanguage) {
      setLocalLanguage(currentLanguage);
    }
  }, [currentLanguage]);

  // this is for running the code i.e generating output
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
    setLocalLanguage(newLanguage);
    updateLanguage(newLanguage);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    changeTheme(newTheme);
  };

  return (
    <div className="flex flex-col space-y-4 rounded-lg border border-gray-300/30 p-6">
      <Header status={status} connectedUsers={connectedUsers} />

      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex space-x-2">
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
        <ThemeSelector onThemeChange={handleThemeChange} />
      </div>

      <div
        id="editor-container"
        className="h-[400px] w-full overflow-hidden rounded-lg border border-gray-700/30 bg-[#1e1e1e]"
      />

      <Output output={output} />
    </div>
  );
}

function Header({ status, connectedUsers }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="text-md mb-2 font-bold text-[#bcfe4d]">CODE EDITOR</div>
      <div className="flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${
            status === "connected" ? "bg-green-400" : "bg-red-500"
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
