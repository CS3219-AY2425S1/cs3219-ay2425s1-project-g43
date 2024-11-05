import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },  
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a specific chat room
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Handle incoming chat messages
  socket.on('sendMessage', (data) => {
    const { roomId, userId, message } = data;

    // Broadcast the message to everyone in the room
    io.to(roomId).emit('receiveMessage', {
      userId,
      message,
      timestamp: Date.now(),
    });
  });

  // Handle user disconnect
  socket.on('disconnect', (reason) => {
    console.log('User disconnected:', reason);
  });
});

// Start the server
const PORT = process.env.PORT || 3005;
const HOST = process.env.HOST || 'localhost';

server.listen(PORT, HOST, () => {
  console.log(`WebSocket server running at ${HOST}:${PORT}`);
});