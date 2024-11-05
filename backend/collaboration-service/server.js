import { WebSocketServer as WSServer } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';
import { MongoClient } from 'mongodb';
import http from 'http';
import express from 'express';
import * as Y from 'yjs';
import 'dotenv/config';

// Track active rooms and their clients
const rooms = new Map(); // roomName -> Set<connection>
const docs = new Map(); // roomName -> Y.Doc

// MongoDB setup
const MONGO_URI = 'mongodb+srv://admin:a28Rl4dekx3IrtU2@collaborationservice.dan5w.mongodb.net/?retryWrites=true&w=majority&appName=CollaborationService';
const DB_NAME = 'yjs-docs';
let mongoClient;

async function initMongo() {
  mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();
  console.log('Connected to MongoDB');
  return mongoClient.db(DB_NAME);
}

// Save document to MongoDB
async function saveDocument(roomName, doc) {
  try {
    const db = mongoClient.db(DB_NAME);
    const collection = db.collection('documents');

    // Convert Yjs document to binary data
    const docData = Buffer.from(Y.encodeStateAsUpdate(doc));

    await collection.updateOne(
      { roomName },
      {
        $set: {
          content: docData,
          lastUpdated: new Date(),
        },
      },
      { upsert: true }
    );

    console.log(`Saved document for room: ${roomName}`);
  } catch (err) {
    console.error('Error saving document:', err);
  }
}

// Load document from MongoDB
async function loadDocument(roomName) {
  try {
    const db = mongoClient.db(DB_NAME);
    const collection = db.collection('documents');

    const docRecord = await collection.findOne({ roomName });
    if (docRecord) {
      const doc = new Y.Doc();
      Y.applyUpdate(doc, docRecord.content.buffer);
      return doc;
    }
    return new Y.Doc();
  } catch (err) {
    console.error('Error loading document:', err);
    return new Y.Doc();
  }
}

// Set up Express and WebSocket server
const app = express();
const server = http.createServer(app);

// Create WebSocket server
const wss = new WSServer({ noServer: true });

// Handle upgrade of the HTTP connection to WebSocket
server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url, 'http://dummy.com');
  const roomName = url.searchParams.get('room') || 'default';

  // Initialize room if it doesn't exist
  if (!rooms.has(roomName)) {
    rooms.set(roomName, new Set());
    loadDocument(roomName).then((doc) => {
      docs.set(roomName, doc);
    });
  }

  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request, roomName);
  });
});

// Handle WebSocket connections
wss.on('connection', (conn, req, roomName) => {
  // Add connection to room
  rooms.get(roomName).add(conn);
  console.log(`Client joined room: ${roomName}`);

  // Set up Y-WebSocket connection
  try {
    setupWSConnection(conn, req);
  } catch (err) {
    console.error('Error setting up WebSocket connection:', err);
    conn.close();
  }

  // Handle disconnection
  conn.on('close', async () => {
    const roomClients = rooms.get(roomName);
    if (roomClients) {
      roomClients.delete(conn);
      console.log(`Client left room: ${roomName}`);

      // If room is empty, save document and clean up
      if (roomClients.size === 0) {
        const doc = docs.get(roomName);
        await saveDocument(roomName, doc);
        rooms.delete(roomName);
        docs.delete(roomName);
        console.log(`Room ${roomName} is empty, saved and cleaned up`);
      }
    } else {
      console.warn(
        `Room ${roomName} not found when trying to remove connection.`
      );
    }
  });
});

// Start the server
async function startServer() {
  try {
    await initMongo();

    const PORT = process.env.PORT || 3006;
    const HOST = process.env.HOST || 'localhost';

    server.listen(PORT, HOST, () => {
      console.log(`WebSocket server running at ${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

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

// Start the server
startServer();
