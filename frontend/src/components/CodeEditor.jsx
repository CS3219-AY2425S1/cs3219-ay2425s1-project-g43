import React, { useState } from "react";
import { useCollaborativeEditor } from "../hooks/useCollaborativeEditor";
import Button from "../components/Button";
import Select from "../components/Select";
import Output from "../components/Output";
import { languages } from "../configs/editor";
import { executePistonCode } from "../services/CollaborationService";
import { useLocation } from "react-router-dom";
import { Play, Loader } from "lucide-react";


export default function CodeEditor() {
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState({
    type: "initial",
    content: "No output yet",
  });
  const [isExecuting, setIsExecuting] = useState(false);

  const location = useLocation();
  const roomName = location.pathname.split("/").pop();

  // Using the custom hook
  const { status, connectedUsers, getContent, setContent, updateLanguage } =
    useCollaborativeEditor({
      roomName,
      wsUrl:
        import.meta.env.VITE_COLLABORATION_SERVICE_BASEURL ||
        "ws://localhost:6006",
      containerId: "editor-container",
      defaultLanguage: language,
    });

  const handleRun = async () => {
    setIsExecuting(true);
    setOutput({ type: "running", content: "Executing code..." });

    const code = getContent();
    const result = await executePistonCode(language, code);

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

    setIsExecuting(false);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    updateLanguage(newLanguage);

    const template =
      languages.find((lang) => lang.value === newLanguage)?.template || "";
    setContent(template);
    setOutput({ type: "initial", content: "No output yet" });
  };

  return (
    <div className="flex flex-col space-y-4 rounded-lg border border-gray-300/30 p-6">
      <Header status={status} connectedUsers={connectedUsers} />

      <div className="mb-4 flex flex-wrap items-start gap-4">
        <Select
          value={language}
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
        className="h-[400px] w-full overflow-hidden rounded-lg border border-gray-700/30 bg-[#1e1e1e] py-1"
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
          className={`h-2 w-2 rounded-full ${status === "connected" ? "bg-green-500" : "bg-red-500"}`}
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
