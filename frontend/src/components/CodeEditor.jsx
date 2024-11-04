import React, { useEffect, useState } from "react";
import { useCollaborativeEditor } from "../hooks/useCollaborativeEditor";
import { useLocation } from "react-router-dom";

const collaborationServiceBaseUrl = import.meta.env.VITE_COLLABORATION_SERVICE_BASEURL;

export default function CodeEditor({ code, setCode, language, setLanguage }) {
  const location = useLocation();
  const roomName = location.pathname.split("/").pop();
  const { status, connectedUsers, getContent, setContent } =
    useCollaborativeEditor({
      roomName,
      wsUrl: collaborationServiceBaseUrl || "ws://localhost:3006",
      containerId: "editor-container",
    });

  const languages = ["Python", "JavaScript", "Java"];

  const handleInputChange = (e) => {
    setCode(e.target.value);
  };

  const renderLineNumbers = () => {
    const lines = code.split("\n").length;
    return Array.from({ length: lines }, (_, i) => i + 1).join("\n");
  };

  return (
    <div className="mb-8">
      <div className="text-L mb-2 font-bold text-[#bcfe4d]">CODE EDITOR</div>
      <div className="rounded bg-[#1e1e1e] p-4">
        <div className="mb-4 flex gap-2">
          {languages.map((lang) => (
            <button
              key={lang}
              className={`rounded-full px-4 py-1 text-sm text-black transition-colors ${
                language === lang
                  ? "bg-[#bcfe4d]"
                  : "bg-[#DDDDDD] hover:bg-[#bcfe4d]"
              }`}
              onClick={() => setLanguage(lang)}
            >
              {lang}
            </button>
          ))}
        </div>
        <div className="relative flex bg-gray-100/10">
          <div className="bg-gray-100/10 p-2 pt-4 text-right text-[#888]">
            <pre>{renderLineNumbers()}</pre>
          </div>
          <div
            id="editor-container"
            onChange={handleInputChange}
            style={{ minHeight: "400px" }}
            className="focus:ring-none h-[500px] w-full resize-none rounded bg-gray-100/10 p-4 text-white focus:outline-none focus:ring-0"
            spellCheck="false"
            placeholder="Write your code here..."
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="rounded-full bg-[#DDDDDD] px-4 py-1 text-sm text-black transition-colors hover:bg-[#bcfe4d]">
            Run
          </button>
          <button className="rounded-full bg-[#bcfe4d] px-4 py-1 text-sm text-black transition-colors hover:bg-[#a6e636]">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
