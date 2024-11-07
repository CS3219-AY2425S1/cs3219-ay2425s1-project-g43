import { WebSocketServer as WSServer } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';
import { MongoClient } from 'mongodb';
import http from 'http';
import express from 'express';
import * as Y from 'yjs';
import 'dotenv/config';
import {
  saveUserHistory,
  findUserHistoryById,
  findUserHistoryByUserId,
} from './model/repository.js';
import { connectToDB } from './model/repository.js';
import jwt from 'jsonwebtoken';

const roomConnections = new Map(); // roomName -> Set<UserId>
const roomInfo = new Map(); // roomName -> { Set<UserId>, questionId }

// Save document to MongoDB
async function saveDocument(roomName, doc) {
  // try {
  //   const db = mongoClient.db(DB_NAME);
  //   const collection = db.collection('documents');
  //   // Convert Yjs document to binary data
  //   const docData = Buffer.from(Y.encodeStateAsUpdate(doc));
  //   await collection.updateOne(
  //     { roomName },
  //     {
  //       $set: {
  //         content: docData,
  //         lastUpdated: new Date(),
  //       },
  //     },
  //     { upsert: true }
  //   );
  //   console.log(`Saved document for room: ${roomName}`);
  // } catch (err) {
  //   console.error('Error saving document:', err);
  // }
}

// Load document from MongoDB
async function loadDocument(roomName) {
  // try {
  //   const db = mongoClient.db(DB_NAME);
  //   const collection = db.collection('documents');
  //   const docRecord = await collection.findOne({ roomName });
  //   if (docRecord) {
  //     const doc = new Y.Doc();
  //     Y.applyUpdate(doc, docRecord.content.buffer);
  //     return doc;
  //   }
  //   return new Y.Doc();
  // } catch (err) {
  //   console.error('Error loading document:', err);
  //   return new Y.Doc();
  // }
}

// Set up Express and WebSocket server
const app = express();
const server = http.createServer(app);

// Create WebSocket server
const wss = new WSServer({ noServer: true });

// Handle upgrade of the HTTP connection to WebSocket
server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url, 'http://dummy.com');

  const roomName = url.searchParams.get('roomName') || 'default';
  const token = url.searchParams.get('token');
  const userId = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      console.log('Authentication failed');
      return;
    }

    return user.id;
  });

  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request, roomName, userId);
  });
});

// Handle WebSocket connections
wss.on('connection', (conn, req, roomName, userId) => {
  // Set up Y-WebSocket connection
  try {
    setupWSConnection(conn, req);
    console.log(`Client ${userId} joined room: ${roomName}`);

    if (!roomConnections.has(roomName)) {
      roomConnections.set(roomName, new Set());
    }
    roomConnections.get(roomName).add(userId);

    if (!roomInfo.has(roomName)) {
      roomInfo.set(roomName, {
        userIds: new Set(),
        questionId: null,
      });
    }

    roomInfo.get(roomName).userIds.add(userId);

    console.log('Room connections');
    console.log(roomConnections);
  } catch (e) {
    console.error('Error setting up Y-WebSocket connection:', e);
    conn.close();
  }

  // Handle disconnection
  conn.on('close', async () => {
    console.log(`Client left room: ${roomName}`);

    roomConnections.get(roomName).delete(userId);
    console.log('Room connections');
    console.log(roomConnections);
    if (roomConnections.get(roomName).size === 0) {
      roomConnections.delete(roomName);
      console.log('Saving');
      console.log(roomInfo.get(roomName));
    }
    // If room is empty, save document and clean up
    // if (roomClients.size === 0) {
    // const doc = docs.get(roomName);
    // await saveDocument(roomName, doc);
    // docs.delete(roomName);
    // console.log(`Room ${roomName} is empty, saved and cleaned up`);
    // }
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
