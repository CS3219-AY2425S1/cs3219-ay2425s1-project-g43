import React, { useEffect, useState, useRef} from "react";
import communicationService from "../services/CommunicationService";
import { fetchCurrentUser } from "../services/UserService";

export default function ChatBox({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const chatEndRef = useRef(null);
  const [isInRoom, setIsInRoom] = useState(true);
  const sessionKey = "chatMessages_${roomId}";

  // Load messages from localStorage when the component mounts
  useEffect(() => {
    try {
      const savedMessages = JSON.parse(localStorage.getItem(sessionKey));
      if (savedMessages) {
        console.log("Loaded saved messages from localStorage:", savedMessages);
        savedMessages.forEach((msg) => {
          setMessages((prevMessages) => [...prevMessages, msg]);
        });
      }
    } catch (error) {
      console.error("Failed to parse messages from localStorage", error);
    }
  }, [sessionKey]);


  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser.data);
      } catch (error) {
        console.error(error.message);
      }
    };
    getUser();
  }, []);

  const userId = user?.username;

  useEffect(() => {
    // Connect to the communication service
    communicationService.connect();

    //  Join the room
    console.log("Joining room:", roomId);
    communicationService.joinRoom(roomId);

    // Listen for incoming messages and update state
    communicationService.onReceiveMessage((message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      // Leave the room
      console.log("Leaving room:", roomId);
      communicationService.disconnect();
    };
  }, [roomId]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(sessionKey, JSON.stringify(messages));
    console.log("Updated localStorage with messages:", messages);
  }, [messages, sessionKey]);

  const handleSend = () => {
    if (newMessage.trim()) {
      communicationService.sendMessage(roomId, userId, newMessage);
      
      // Clear the input field
      setNewMessage("");
    }
  };

  

  useEffect(() => {
    // Scroll to the bottom of the chat
    if (chatEndRef.current) {
      chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
    }
  }, [messages]);

  // useEffect(() => {
  //   const handleUnload = () => {
  //     if (!isInRoom) {
  //       localStorage.removeItem(sessionKey);
  //     }
  //   };
  
  //   window.addEventListener("beforeunload", handleUnload);
  //   return () => {
  //     window.removeEventListener("beforeunload", handleUnload);
  //   };
  // }, [sessionKey]);

  return (
    <div className="mb-8">
      <div className="text-L font-bold text-[#bcfe4d] mb-2">CHAT</div>
      <div className="bg-[#1e1e1e] rounded p-4 h-[300px] flex flex-col">
        <div ref={chatEndRef} className="flex-1 overflow-auto">
          <div className="flex-1 overflow-auto mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 px-4 py-2 rounded-full text-sm max-w-[80%] ${
                  msg.userId === userId 
                    ? "bg-[#bcfe4d] text-black ml-auto" 
                    : "bg-[#ffffff] text-black mr-auto"
                }`}            >
                <p>{msg.message}</p>
                <p className="text-xs text-right" style={{lineHeight: '0.75'}}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-[#333333] text-white px-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-[#bcfe4d]"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 rounded-full text-sm text-black bg-[#bcfe4d] hover:bg-[#a6e636] transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );  
}