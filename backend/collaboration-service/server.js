import { WebSocketServer as WSServer } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';
import { MongoClient, ObjectId, UUID } from 'mongodb';
import http from 'http';
import express from 'express';
import * as Y from 'yjs';
import 'dotenv/config';
import {
  saveUserHistory,
  getUserHistoryByRoomname,
  createNewUserHistory,
  addUserToUserHistory,
} from './model/repository.js';
import { connectToDB } from './model/repository.js';
import jwt from 'jsonwebtoken';
import userHistoryRouter from './routes/user-history-route.js';
import cors from 'cors';

// Set up Express and WebSocket server
const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      'http://localhost:3005',
      'http://localhost:6000',
      'http://localhost:6001',
      'http://localhost:6002',
      'http://localhost:6003',
      'http://47.129.236.67:3000',
      'http://47.129.236.67:3001',
      'http://47.129.236.67:3002',
      'http://47.129.236.67:3003',
      'http://47.129.236.67:3004',
      'http://47.129.236.67:3005',
      'http://47.129.236.67:6000',
      'http://47.129.236.67:6001',
      'http://47.129.236.67:6002',
      'http://47.129.236.67:6003',
    ], // Allow requests from this origin
    methods: ['GET', 'POST'], // Allowed methods
    allowedHeaders: ['Authorization'], // Allowed headers if needed
    credentials: true, // Allow credentials
  })
);

// Create WebSocket server
const wss = new WSServer({ noServer: true });
app.use('/userHistory', userHistoryRouter);

// Handle upgrade of the HTTP connection to WebSocket
server.on('upgrade', (request, socket, head) => {
  try {
    const url = new URL(request.url, 'http://dummy.com');
    const roomName = url.searchParams.get('roomName') || 'default';
    const token = url.searchParams.get('token');
    const questionString = url.searchParams.get('questionString');
    const question = JSON.parse(questionString);
    const userId = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        console.log('Authentication failed');
        return;
      }

      return user.id;
    });

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request, roomName, userId, question);
    });
  } catch (e) {
    console.error('Error handling upgrade:', e);
    socket.destroy();
  }
});

// Handle WebSocket connections
wss.on('connection', async (conn, req, roomName, userId, question) => {
  // Set up Y-WebSocket connection
  try {
    setupWSConnection(conn, req);
    console.log(`Client ${userId} joined room: ${roomName}`);

    let userHistory = await getUserHistoryByRoomname(roomName);
    if (!userHistory) {
      userHistory = await createNewUserHistory(roomName, userId, question);
    }
    if (userHistory.firstUserId != userId && !userHistory.secondUserId) {
      await addUserToUserHistory(roomName, userId);
    }
  } catch (e) {
    console.error('Error setting up Y-WebSocket connection:', e);
    conn.close();
  }

  conn.on('message', async (arrayBuffer) => {
    const enc = new TextDecoder('utf-8');
    try {
      const message = JSON.parse(enc.decode(arrayBuffer));
      console.log('Received message:', message);
      if (message.event === 'save') {
        const { roomName, document } = message;
        const savedHistory = await saveUserHistory(roomName, document);
        console.log(savedHistory);
      }
    } catch {
      // Message is not an custom event
    }
  });

  conn.on('save', (content) => {
    console.log(content);
  });
  // Handle disconnection
  conn.on('close', async () => {
    console.log(`Client left room: ${roomName}`);
  });
});

await connectToDB()
  .then(() => {
    try {
      const PORT = process.env.PORT || 3006;
      const HOST = process.env.HOST || 'localhost';

      server.listen(PORT, HOST, () => {
        console.log(`WebSocket server running at ${HOST}:${PORT}`);
      });
    } catch (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('Failed to connect to DB');
    console.error(err);
  });

// Graceful shutdown
async function shutdown() {
  console.log('Shutting down...');

  // Save all active documents
  for (const [roomName, doc] of docs.entries()) {
    await saveDocument(roomName, doc);
  }

  // Close MongoDB connection
  if (mongoClient) {
    await mongoClient.close();
  }

  // Close WebSocket server
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
