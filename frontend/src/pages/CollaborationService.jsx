import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PeerPrep from "./PeerPrep";
import CodeEditor from "../components/CodeEditor";
import ChatBox from "../components/ChatBox";
import Problems from "../components/Problems";

export default function CollaborationService() {
  const location = useLocation();
  const question = location.state?.question;
  console.log("Question ID:", question);
  const [problem, setProblem] = useState(question);
  const roomId = location.pathname.split("/").pop();

  return (
    <PeerPrep>
      <main className="flex-1 overflow-auto">
        <div className="flex gap-4">
          <div className="flex-1">
            <Problems problem={problem} />
          </div>
          <div className="flex-[1.5]">
            <CodeEditor />
          </div>
          <div className="flex-[0.5]">
            <ChatBox roomId={roomId} />
          </div>
        </div>
      </main>
    </PeerPrep>
  );
}
