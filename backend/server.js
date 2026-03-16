const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

let rooms = {};

// create room API
app.post("/api/create-room", (req, res) => {
  const roomId = uuidv4().slice(0, 6);
  rooms[roomId] = { users: [] };

  res.json({
    success: true,
    roomId: roomId
  });
});

// check room API
app.get("/api/room/:id", (req, res) => {
  const roomId = req.params.id;

  if (rooms[roomId]) {
    res.json({ exists: true });
  } else {
    res.json({ exists: false });
  }
});

// socket connection
io.on("connection", (socket) => {

  socket.on("join-room", ({ roomId, username }) => {

    if (!rooms[roomId]) {
      rooms[roomId] = { users: [] };
    }

    socket.join(roomId);

    rooms[roomId].users.push({
      id: socket.id,
      username: username
    });

    io.to(roomId).emit("user-joined", username);

  });

  socket.on("send-message", ({ roomId, message, username }) => {
    io.to(roomId).emit("receive-message", {
      username,
      message,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      rooms[roomId].users = rooms[roomId].users.filter(
        u => u.id !== socket.id
      );

      if (rooms[roomId].users.length === 0) {
        delete rooms[roomId];
      }
    }
  });

});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
