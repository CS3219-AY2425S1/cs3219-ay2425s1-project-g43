import { WebSocketServer as WSServer } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';
import { MongoClient, ObjectId, UUID } from 'mongodb';
import http from 'http';
import express from 'express';
import * as Y from 'yjs';
import 'dotenv/config';
import {
  saveUserHistory,
  findUserHistoryById,
  findUserHistoryByUserId,
  createNewUserHistory,
  addUserToUserHistory,
} from './model/repository.js';
import { connectToDB } from './model/repository.js';
import jwt from 'jsonwebtoken';
import userHistoryRouter from './routes/user-history-route.js';

const roomInfo = new Map(); // roomName -> { Set<UserId>, question }

// Set up Express and WebSocket server
const app = express();
const server = http.createServer(app);

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
wss.on('connection', (conn, req, roomName, userId, question) => {
  // Set up Y-WebSocket connection
  try {
    setupWSConnection(conn, req);
    console.log(`Client ${userId} joined room: ${roomName}`);

    if (!roomInfo.has(roomName)) {
      const newUserHistory = createNewUserHistory(userId, question);
      roomInfo.set(roomName, {
        uuid: newUserHistory._id,
        userIds: new Set(),
        question,
      });
    }

    if (!roomInfo.get(roomName).userIds.has(userId)) {
      roomInfo.get(roomName).userIds.add(userId);
      addUserToUserHistory(roomInfo.get(roomName).uuid, userId);
    }
  } catch (e) {
    console.error('Error setting up Y-WebSocket connection:', e);
    conn.close();
  }

  conn.on('save', async (document) => {
    console.log('Save requested');
    const _id = roomInfo.get(roomName).uuid;
    const result = await saveUserHistory(_id, document);
    console.log('saved');
    console.log(result);
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
