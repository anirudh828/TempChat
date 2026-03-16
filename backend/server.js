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

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST']
}));
app.use(express.json());

// Routes will be mounted here
app.use('/api/rooms', require('./routes/roomRoutes'));

// --- NEW HOME ROUTE ---
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
      <h1 style="color: #4f46e5;">TempChat API is Live! 🚀</h1>
      <p>Your backend server is running successfully on Render.</p>
    </div>
  `);
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'TempChat backend is running' });
});

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
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
