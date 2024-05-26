const http = require('http');
const express = require('express')
const connectAndPerformOperations = require('./mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const socketIo = require('socket.io');
const path = require('path')
// Import routes
const router = require('./frontendData/SignUp');
const routerLogging = require('./frontendData/Login');
const routerget = require('./database/getData');
const getDatabyFriend = require('./database/getDatabyFriend');
const routerFriend = require('./frontendData/sendFrinendRequest');
const routerProfile = require('./frontendData/profile');
const routerMessage = require('./frontendData/messages');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json()); // Add body parser middleware for handling JSON requests
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your client app's origin
  methods: ['GET', 'POST','DELETE','PUT'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Connect to MongoDB and perform operations
connectAndPerformOperations()
  .then(() => {
    console.log('MongoDB connection successful');
  })
  .catch((error) => {
    console.log('Error:', error);
  });

// Routes
app.use(router);
app.use(routerLogging);
app.use(routerget);
app.use(routerFriend);
app.use(routerProfile);
app.use(getDatabyFriend);
app.use(routerMessage);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create HTTP server
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow CORS for Socket.io
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('joinRoom', ({ sender, recipient }) => {
    const room = [sender, recipient].sort().join('_');
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('leaveRoom', ({ sender, recipient }) => {
    const room = [sender, recipient].sort().join('_');
    socket.leave(room);
    console.log(`User left room: ${room}`);
  });

  socket.on('message', (message) => {
    const room = [message.sender, message.recipient,message.like,message.dislike,message.file].sort().join('_');
    io.to(room).emit('message', message);
        console.log(`Message sent to room ${room}: ${message}`);

    // console.log(`Message sent to room ${room}: ${message.text}`);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
