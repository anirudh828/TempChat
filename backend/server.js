const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const { connectDB } = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: true, // Allows your frontend to connect regardless of the URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Routes
app.use('/api/rooms', require('./routes/roomRoutes'));

// Health Check & Home Route
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
      <h1 style="color: #4f46e5;">TempChat API is Live! 🚀</h1>
      <p>Connected to MongoDB successfully.</p>
    </div>
  `);
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'TempChat backend is running' });
});

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Allows socket connections from your frontend
    methods: ['GET', 'POST']
  }
});

// Import socket logic
const chatSocket = require('./socket/chatSocket');
chatSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
