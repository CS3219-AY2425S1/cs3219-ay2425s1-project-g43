import { io } from "socket.io-client";

const communicationServiceBaseURL = import.meta.env.VITE_COMMUNICATION_SERVICE_BASEURL;
class CommunicationService {
  constructor() {
    this.socket = null;
    this.url = communicationServiceBaseURL || "http://localhost:3005"; // Ensure you set this in your environment variables
  }

  // Initialize the Socket.IO connection
  connect() {
    this.socket = io(this.url);
    console.log("Connected to Communication Service");
  } 

  // Join a specific room
  joinRoom(roomId) {
    this.socket.emit("joinRoom", roomId);
  }

  // Send a message to the server to broadcast to the room
  sendMessage(roomId, userId, message) {
    this.socket.emit("sendMessage", {roomId, userId, message});
  }

  // Listen for incoming messages
  onReceiveMessage(callback) {
    this.socket.on("receiveMessage", callback);
  }

  // Disconnect the socket connection
  disconnect() {
    this.socket.disconnect();
    console.log("Disconnected from Communication Service");
  }
}

// Export a singleton instance
const communicationService = new CommunicationService();
export default communicationService;