import Redis from 'ioredis';
import { io } from '../server.js';

let socketChannel;

export const startRedis = async () => {
  socketChannel = new Redis({
    port: 6379,
    host: 'localhost',
  });
};

export const enqueueSocket = async (socketId, topic, complexity, waitTime) => {
  // Check if there is another socket in the queue with the same complexity
  const topicAndComplexity = `${topic}:${complexity}`;
  const waitTimeInSeconds =
    waitTime <= 5 ? parseInt(waitTime) * 60 : parseInt(waitTime);

  if (isNaN(waitTimeInSeconds) || waitTimeInSeconds < 0) {
    console.error(`Invalid waitTimeInSeconds: ${waitTimeInSeconds}`);
    io.to(socketId).emit('error', 'Invalid wait time');
    return;
  }
  const matchExists = await socketChannel.get(topicAndComplexity); //return null if not found, else socketId. Ideally same as socketId
  if (matchExists) {
    // Found a match
    const socketId2 = await socketChannel.get(topicAndComplexity); //get socketId of match
    socketChannel.del(topicAndComplexity); //delete this socketId from the queue

    // TODO: Replace with collaboration service room id
    const roomId = Math.random().toString(36).substring(7);
    io.to(socketId).emit('matchFound', roomId);
    io.to(socketId2).emit('matchFound', roomId);
    console.log(`Matched ${socketId} with ${socketId2}, roomId: ${roomId}`);
    if (socketId === socketId2) {
      // If both sockets are the same, disconnect the socket
      io.sockets.connected[socketId].disconnect();
    }
    io.sockets.sockets.get(socketId).disconnect();
    io.sockets.sockets.get(socketId2).disconnect();
    console.log(`Disconnected ${socketId} and ${socketId2}`);
  } else {
    // No match found
    console.log('Waiting for match');
    io.to(socketId).emit('message', 'Waiting for a match');
    await storeSocket(socketId, topic, complexity, waitTimeInSeconds);
    setTimeout(
      () => onSocketExpiry(socketId, topic, complexity),
      waitTimeInSeconds * 1000
    );
  }
};

const storeSocket = async (socketId, topic, complexity, waitTimeInSeconds) => {
  const topicAndComplexity = `${topic}:${complexity}`;
  try {
    await socketChannel.set(topicAndComplexity, socketId);
    console.log(topicAndComplexity);
  } catch (error) {
    console.log(error.message);
    io.to(socketId).emit('error', 'Failed to store socket');
    io.sockets.connected[socketId].disconnect();
  }
};

const onSocketExpiry = async (socketId, topic, complexity) => {
  try {
    // Check if socket is still in the queue
    const topicAndComplexity = `${topic}:${complexity}`;
    const retrievedSocketId = await socketChannel.get(topicAndComplexity); //returns socketId
    if (retrievedSocketId === socketId) {
      // Remove socket from queue
      socketChannel.del(topicAndComplexity);
      io.to(socketId).emit('message', 'Failed to find match');
      console.log(`Socket ${socketId} failed to find a match`);
      io.in(socketId).disconnectSockets();
      console.log(`Disconnected ${socketId}`);
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const dequeueSocket = async (socketId, topic, complexity) => {
  const topicAndComplexity = `${topic}:${complexity}`;
  try {
    const matchExists = await socketChannel.get(topicAndComplexity);
    if (matchExists === socketId) {
      socketChannel.del(topicAndComplexity);
      console.log(`Removed ${socketId} from queue`);
    } else {
      console.log(`Socket ${socketId} not found in queue`);
    }
  } catch (error) {
    console.log(error.message);
  }
};
