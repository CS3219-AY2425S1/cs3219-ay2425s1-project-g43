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
import { Modal } from "./LanguageModal";

const collaborationServiceBaseUrl = import.meta.env
  .VITE_COLLABORATION_SERVICE_BASEURL;

const getTemplateForLanguage = (language) => {
  return languages.find((lang) => lang.value === language)?.template || "";
};

export default function CodeEditor() {
  const [localLanguage, setLocalLanguage] = useState("python");
  const [theme, setTheme] = useState("vs-dark");
  const [output, setOutput] = useState({
    type: "initial",
    content: "No output yet",
  });
  const [isExecuting, setIsExecuting] = useState(false);
  const location = useLocation();
  const [modalState, setModalState] = useState({
    isOpen: false,
    pendingLanguage: null,
  });
  const question = location.state?.question;

  const user = React.useMemo(
    () => ({
      name: `Anonymous-${Math.random().toString(36).substr(2, 9)}`,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    }),
    [],
  );

  const {
    status,
    editor,
    connectedUsers,
    currentLanguage,
    getContent,
    setContent,
    updateLanguage,
    changeTheme,
    emitSave,
  } = useCollaborativeEditor({
    roomName: location.pathname.split("/").pop(),
    wsUrl: collaborationServiceBaseUrl || "ws://localhost:3006",
    containerId: "editor-container",
    defaultLanguage: localLanguage,
    theme,
    user,
    question,
  });

  // Sync local language with shared language
  useEffect(() => {
    if (currentLanguage !== localLanguage) {
      setLocalLanguage(currentLanguage);
    }
  }, [currentLanguage]);

  // Handle code execution
  const handleRun = async () => {
    setIsExecuting(true);
    setOutput({ type: "running", content: "Executing code..." });

    try {
      const code = getContent();
      if (!code.trim()) {
        throw new Error("No code to execute");
      }

      const result = await executePistonCode(localLanguage, code);

      if (result.success) {
        setOutput({
          type: "success",
          content: result.output || "Code executed successfully with no output",
        });
      } else {
        const errorPrefix =
          {
            compilation: "⚠️ Compilation Error:\n",
            runtime: "❌ Runtime Error:\n",
            system: "⚠️ System Error:\n",
          }[result.errorType] || "⚠️ Error:\n";

        setOutput({
          type: "error",
          content: errorPrefix + (result.error || "Unknown error occurred"),
        });
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

  // Handle language changes with confirmation if needed
  const handleLanguageChange = (newLanguage) => {
    const currentCode = getContent();
    const oldLanguage = currentLanguage;
    const oldTemplate = getTemplateForLanguage(oldLanguage)?.trim();

    // Check if content matches template or is empty
    if (!currentCode.trim() || currentCode.trim() === oldTemplate) {
      updateLanguage(newLanguage);
      const newTemplate = getTemplateForLanguage(newLanguage);
      setContent(newTemplate);
    } else {
      setModalState({
        isOpen: true,
        pendingLanguage: newLanguage,
      });
    }
  };

  const handleModalConfirm = () => {
    if (modalState.pendingLanguage) {
      updateLanguage(modalState.pendingLanguage);
      const newTemplate = getTemplateForLanguage(modalState.pendingLanguage);
      setContent(newTemplate);
    }
    setModalState({ isOpen: false, pendingLanguage: null });
  };

  // Handle theme changes
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    changeTheme(newTheme);
  };

  const handleModalClose = () => {
    setModalState({ isOpen: false, pendingLanguage: null });
  };

  return (
    <div className="flex w-full flex-col space-y-4 rounded-lg border border-gray-300/30 p-6">
      <Header />

      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={localLanguage}
            onChange={handleLanguageChange}
            options={languages}
            className="min-w-[150px]"
            disabled={true}
          />
          <Button
            onClick={handleRun}
            disabled={isExecuting}
            icon={isExecuting ? Loader : Play}
            className={isExecuting ? "animate-spin" : ""}
          >
            {isExecuting ? "Running..." : "Run"}
          </Button>
        </div>

        <ThemeSelector currentTheme={theme} onThemeChange={handleThemeChange} />
      </div>

      <div
        id="editor-container"
        className="h-[400px] w-full overflow-hidden rounded-lg border border-gray-700/30 bg-[#1e1e1e]"
      />

      <Output output={output} className="max-h-[200px] overflow-auto" />

      <Modal
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        newLanguage={modalState.pendingLanguage}
      />
    </div>
  );
}

function Header() {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="text-md mb-2 font-bold text-[#bcfe4d]">CODE EDITOR</div>
      <div className="flex items-center gap-2" />
    </div>
  );
}
