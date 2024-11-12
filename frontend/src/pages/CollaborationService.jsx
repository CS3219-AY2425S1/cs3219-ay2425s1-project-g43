import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PeerPrep from "./PeerPrep";
import CodeEditor from "../components/CodeEditor";
import ChatBox from "../components/ChatBox";
import AiChatBox from "../components/AiChatBox";
import Problems from "../components/Problems";
import EndSessionModal from "../components/EndSessionModal";

export default function CollaborationService() {
  const location = useLocation();
  const question = location.state?.question;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [problem, setProblem] = useState(question);
  const [messages, setMessages] = useState([]); 
  const roomId = location.pathname.split("/").pop();

  const sendMessage = (text, sender = "me") => {
    setMessages((prevMessages) => [...prevMessages, { sender, text }]);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleEndSession = () => {
    navigate("/dashboard");
  }

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
          <div className="flex h-[750px] flex-col space-y-4 rounded-lg border border-gray-300/30 p-6">
          <button
            onClick={openModal}
            className="rounded-full bg-red-500 px-6 py-2 text-white hover:bg-red-600">
            End Session
          </button>
            <div className="flex-[0.5]">
              <ChatBox
                roomId={roomId}
                messages={messages}
                setMessages={setMessages}
              />
              <AiChatBox
                messages={messages}
                sendMessage={sendMessage}
                problem={problem}
              />
            </div>
          </div>
        </div>
        <div>
          <EndSessionModal
            isOpen={isModalOpen}
            handleEndSession={handleEndSession}
            handleClose={closeModal}       
          />
        </div>
      </main>
    </PeerPrep>
  );
}
