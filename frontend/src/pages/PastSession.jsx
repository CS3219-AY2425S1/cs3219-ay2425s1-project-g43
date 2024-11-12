import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchUserHistoryWithRoomname } from "../services/UserHistory";
import PeerPrep from "./PeerPrep";
import CodeEditor from "../components/CodeEditor";
import ChatBox from "../components/ChatBox";
import AiChatBox from "../components/AiChatBox";
import Problems from "../components/Problems";
import CodeViewer from "../components/CodeViewer";

const PastSession = () => {
  const location = useLocation();
  const historyId = location.pathname.split("/").pop();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async (historyId) => {
      try {
        const session = await fetchUserHistoryWithRoomname(historyId);
        console.log(session);
        setSession(session);
        return session;
      } catch (error) {
        console.error(error);
      }
    };

    getSession(historyId);
  }, []);

  return (
    <PeerPrep>
      <main className="flex-1 overflow-auto">
        <div className="flex gap-4">
          <div className="flex-1">
            {session && <Problems problem={session.question} />}
          </div>
          <div className="flex-[1.5]">
            {session && (
              <CodeViewer code={session.document} language={session.language} />
            )}
          </div>
        </div>
      </main>
    </PeerPrep>
  );
};

export default PastSession;
