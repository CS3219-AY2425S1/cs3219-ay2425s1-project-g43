import React, { useState, useRef, useEffect } from "react";

const aiServiceBaseUrl = 'http://localhost:3007';

console.log(aiServiceBaseUrl);
export default function AiChatBox({ messages, sendMessage, problem }) {
  const [newMessage, setNewMessage] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [chatHistory]);

  useEffect(() => { if (messagesEndRef.current) { messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight; } }, [chatHistory, isLoading]);

  const handleSendUserMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      text: newMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setNewMessage("");
  };

  const handleSendAiMessage = async () => {
    if (!aiMessage.trim()) return;

    const userMessage = {
      text: aiMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${aiServiceBaseUrl}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: aiMessage,
          context: problem?.description || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const aiResponseMessage = {
        text: data.response,
        sender: "ai",
        timestamp: new Date().toISOString(),
      };

      setChatHistory((prev) => [...prev, aiResponseMessage]);
    } catch (error) {
      console.error("AI response error:", error);
      const errorMessage = {
        text: "Sorry, I encountered an error. Please try again.",
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setAiMessage("");
    }
  };

  return (
    <div className="mb-8">
      <div className="text-L font-bold text-[#bcfe4d] mb-2">AI Assistant</div>
      <div className="bg-[#1e1e1e] rounded p-4 flex flex-col">
        {/* Scrollable chat history */}
        <div className="flex-1 overflow-y-auto mb-4" style={{ maxHeight: "250px" }}>
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 px-4 py-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-[#bcfe4d] text-black ml-auto"
                  : "bg-[#4a90e2] text-white"
              } max-w-[80%] break-words`}
            >
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="bg-[#4a90e2] text-white px-4 py-2 rounded-lg max-w-[80%]">
              AI is thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* AI Assistance Chatbox */}
        <p className="text-sm text-gray-400 mt-4 mb-2">
          AI Assistance Chat
        </p>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={aiMessage}
            onChange={(e) => setAiMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendAiMessage()}
            className="flex-1 bg-[#333333] text-white px-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-white"
            placeholder="Type your message for AI..."
            disabled={isLoading}
            style={{ height: "40px" }}
          />
          <button
            onClick={handleSendAiMessage}
            className={`px-4 py-2 rounded-full text-sm text-black ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#4a90e2]"
            } transition-colors`}
            disabled={isLoading}
          >
            To AI
          </button>
        </div>
      </div>
    </div>
  );
}
