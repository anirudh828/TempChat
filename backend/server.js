const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

const { connectDB } = require('./config/db');

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Middleware — flexible CORS for deployment
const allowedOrigin = process.env.FRONTEND_URL || '*';
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Normalize comparison — strip trailing slashes
    const normalizedOrigin = origin.replace(/\/+$/, '');
    const normalizedAllowed = allowedOrigin.replace(/\/+$/, '');
    if (allowedOrigin === '*' || normalizedOrigin === normalizedAllowed) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Routes will be mounted here
app.use('/api/rooms', require('./routes/roomRoutes'));
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'TempChat backend is running' });
});

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/+$/, '');
      const normalizedAllowed = allowedOrigin.replace(/\/+$/, '');
      if (allowedOrigin === '*' || normalizedOrigin === normalizedAllowed) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Import socket logic
const chatSocket = require('./socket/chatSocket');
chatSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
