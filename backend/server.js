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
app.use(express.static(path.join(__dirname, "public")));

let rooms = {};

// CREATE ROOM
app.post("/create-room", (req, res) => {

    const roomId = uuidv4().slice(0,6);

    rooms[roomId] = [];

    res.json({
        success: true,
        roomId: roomId
    });

});

// CHECK ROOM
app.get("/room/:id", (req,res)=>{

    const roomId = req.params.id;

    if(rooms[roomId]){
        res.json({exists:true})
    }else{
        res.json({exists:false})
    }

});


io.on("connection", (socket) => {

    socket.on("join-room", ({roomId, username}) => {

        socket.join(roomId);

        socket.to(roomId).emit("user-joined", username);

    });

    socket.on("send-message", ({roomId, message, username}) => {

        io.to(roomId).emit("receive-message", {
            username,
            message
        });

    });

});

server.listen(PORT, ()=>{
    console.log("Server running on port " + PORT);
});
