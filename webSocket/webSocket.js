// Import required modules
const express = require('express'); // Express framework
const http = require('http'); // HTTP module
const socketIo = require('socket.io'); // Socket.IO for WebSocket communication

// Define a function to create a WebSocket server
const createWebSocketServer = (port) => {
  // Create an Express app
  const app = express();
  
  // Create an HTTP server using the Express app
  const server = http.createServer(app);
  
  // Create a Socket.IO instance and pass the HTTP server to it
  const io = socketIo(server);

  // Object to store connected clients and their friend requests
  const clients = {};

  // Event listener for when a client connects to the server
  io.on('connection', (socket) => {
    console.log('Client connected'); // Log that a client has connected

    // Event listener for when a client sends a friend request
    socket.on('friend_request', (recipientId) => {
      const senderId = socket.id;
      const recipientSocket = clients[recipientId];
      if (recipientSocket) {
        recipientSocket.emit('friend_request', senderId);
      } else {
        // Handle case where recipient is not online
      }
    });

    // Event listener for when a client accepts a friend request
    socket.on('accept_friend_request', (senderId) => {
      const recipientId = socket.id;
      const senderSocket = clients[senderId];
      if (senderSocket) {
        senderSocket.emit('friend_request_accepted', recipientId);
      } else {
        // Handle case where sender is not online
      }
    });

    // Event listener for when the server receives a message from a client
    socket.on('message', (message) => {
      console.log('Received message:', message); // Log the received message

      // Broadcast the received message to all connected clients except the sender
      socket.broadcast.emit('message', message);
    });

    // Event listener for when a client disconnects from the server
    socket.on('disconnect', () => {
      console.log('Client disconnected'); // Log that a client has disconnected

      // Remove the client from the clients object
      for (const clientId in clients) {
        if (clients[clientId] === socket) {
          delete clients[clientId];
          break;
        }
      }
    });

    // Add the client to the clients object
    clients[socket.id] = socket;
  });

  // Start the server and listen on the specified port
  server.listen(port, () => {
    console.log(`WebSocket server is listening on port ${port}`); // Log that the WebSocket server is listening
  });

  // Return the created server instance
  return server;
};

// Export the createWebSocketServer function for use in other modules
module.exports = createWebSocketServer;
