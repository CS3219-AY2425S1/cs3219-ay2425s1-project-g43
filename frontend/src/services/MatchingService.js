import { createAxiosInstance } from "./Api";
import { io } from 'socket.io-client';

const matchingServiceBaseURL = import.meta.env.VITE_MATCHING_SERVICE_BASEURL;
const matchingApi = createAxiosInstance(matchingServiceBaseURL);

class MatchingService {
  constructor() {
    this.socket = null;
    this.url = matchingServiceBaseURL || 'http://localhost:3003'; // Ensure you set this in your environment variables
  }

  // Initialize the Socket.IO connection
  connect(token, topic, complexity, waitTime) {
    return new Promise((resolve, reject) => {
      if (this.socket) {
        this.disconnect();
      }

      this.socket = io(this.url, {
        auth: {
          token, // JWT token for authentication
        },
        query: {
          topic,
          complexity,
          waitTime,
        },
      });

      this.socket.on('connect', () => {
        console.log('Connected to Matching Service with socket ID:', this.socket.id);
        resolve(this.socket.id);
      });

      this.socket.on('connect_error', (err) => {
        console.error('Connection Error:', err.message);
        reject(err);
      });
    });
  }

  // Listen for 'matchFound' event
  onMatchFound(callback) {
    if (!this.socket) return;

    this.socket.on('matchFound', (roomId) => {
      callback(roomId);
    });
  }

  // Listen for 'message' event
  onMessage(callback) {
    if (!this.socket) return;

    this.socket.on('message', (msg) => {
      callback(msg);
    });
  }

  // Listen for 'error' event
  onError(callback) {
    if (!this.socket) return;

    this.socket.on('error', (err) => {
      callback(err);
    });
  }

  // Listen for 'disconnect' event
  onDisconnect(callback) {
    if (!this.socket) return;

    this.socket.on('disconnect', (reason) => {
      callback(reason);
    });
  }

  // Disconnect the socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('Disconnected from Matching Service');
    }
  }
}

// Export a singleton instance
const matchingService = new MatchingService();
export default matchingService;
