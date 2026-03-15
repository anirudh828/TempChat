const Room = require('../models/Room');

const chatSocket = (io) => {
  // Map to track socket.id -> { roomId, username }
  const socketMap = new Map();

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a room
    socket.on('join_room', ({ roomId, username }) => {
      socket.join(roomId);
      console.log(`${username} joined room: ${roomId}`);

      // Track the user's socket
      socketMap.set(socket.id, { roomId, username });

      // Notify others in the room
      socket.to(roomId).emit('user_joined', {
        username,
        message: `${username} has joined the chat`
      });
    });

    // Handle new message
    socket.on('send_message', async (data) => {
      try {
        const { roomId, sender, text } = data;

        const newMessage = {
          sender,
          text,
          timestamp: new Date(),
          reactions: {}
        };

        // Broadcast to everyone in the room EXCEPT sender
        socket.to(roomId).emit('receive_message', newMessage);

        // Save to DB via mock Mongoose model
        await Room.addMessage(roomId, newMessage);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    // Handle reactions
    socket.on('send_reaction', async ({ roomId, messageIndex, reaction }) => {
      // Broadcast to everyone else immediately
      socket.to(roomId).emit('receive_reaction', { messageIndex, reaction });
      
      try {
        const room = await Room.findOne({ roomId });
        if (room && room.messages[messageIndex]) {
          // Initialize reactions if it doesn't exist
          if (!room.messages[messageIndex].reactions) {
            room.messages[messageIndex].reactions = {};
          }
          
          const currentCount = room.messages[messageIndex].reactions[reaction] || 0;
          room.messages[messageIndex].reactions[reaction] = currentCount + 1;
          await room.save();
        }
      } catch (error) {
        console.error('Error saving reaction:', error);
      }
    });

    // Handle typing indicator
    socket.on('typing', ({ roomId, username, isTyping }) => {
      socket.to(roomId).emit('user_typing', { username, isTyping });
    });

    // Leave room explicit
    socket.on('leave_room', async ({ roomId, username }) => {
      socket.leave(roomId);
      socketMap.delete(socket.id);
      
      socket.to(roomId).emit('user_left', {
        username,
        message: `${username} has left the chat`
      });
      
      try {
        await Room.removeUser(roomId, username);
      } catch (error) {
        console.error('Error removing user on leave:', error);
      }
    });

    // Handle unexpected disconnects (e.g., page refresh/close)
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.id}`);
      
      const userData = socketMap.get(socket.id);
      if (userData) {
        const { roomId, username } = userData;
        
        socket.to(roomId).emit('user_left', {
          username,
          message: `${username} has left the chat`
        });
        
        try {
          await Room.removeUser(roomId, username);
        } catch (error) {
          console.error('Error removing user on disconnect:', error);
        }
        
        socketMap.delete(socket.id);
      }
    });
  });
};

module.exports = chatSocket;
