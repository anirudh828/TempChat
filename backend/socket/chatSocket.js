const Room = require('../models/Room');

const CREATOR_DISCONNECT_GRACE_MS = 5 * 60 * 1000; // 5 minutes

const chatSocket = (io) => {
  // Maps socket.id -> { roomId, username }
  const socketUserMap = new Map();
  // Maps roomId -> NodeJS.Timeout  (active countdown for creator disconnect)
  const creatorTimers = new Map();

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a room
    socket.on('join_room', async ({ roomId, username }) => {
      socket.join(roomId);
      socketUserMap.set(socket.id, { roomId, username });
      console.log(`${username} joined room: ${roomId}`);

      // If creator reconnected while timer was running — cancel the countdown
      const room = await Room.findOne({ roomId });
      if (room && room.creator === username && creatorTimers.has(roomId)) {
        clearTimeout(creatorTimers.get(roomId));
        creatorTimers.delete(roomId);
        console.log(`Creator ${username} reconnected — cancelling room deletion for ${roomId}`);
        // Notify others the host is back
        socket.to(roomId).emit('host_reconnected', {
          message: `Host "${username}" has reconnected. Room is safe! ✅`
        });
      }

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

        // Save to DB
        await Room.addMessage(roomId, newMessage);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    // Handle reactions — one reaction per user per message
    socket.on('send_reaction', async ({ roomId, messageIndex, reaction }) => {
      const userInfo = socketUserMap.get(socket.id);
      if (!userInfo) return;
      const reactorUsername = userInfo.username;

      try {
        const room = await Room.findOne({ roomId });
        if (room && room.messages[messageIndex]) {
          if (!room.messages[messageIndex].reactions) {
            room.messages[messageIndex].reactions = {};
          }

          const reactors = room.messages[messageIndex].reactions[reaction] || [];
          
          // Prevent duplicate — same user already reacted with this emoji
          if (reactors.includes(reactorUsername)) return;

          room.messages[messageIndex].reactions[reaction] = [...reactors, reactorUsername];
          await room.save();

          // Broadcast to everyone else
          socket.to(roomId).emit('receive_reaction', { messageIndex, reaction, username: reactorUsername });
        }
      } catch (error) {
        console.error('Error saving reaction:', error);
      }
    });

    // Handle typing indicator
    socket.on('typing', ({ roomId, username, isTyping }) => {
      socket.to(roomId).emit('user_typing', { username, isTyping });
    });

    // Leave room
    socket.on('leave_room', ({ roomId, username }) => {
      socket.leave(roomId);
      socketUserMap.delete(socket.id);
      socket.to(roomId).emit('user_left', {
        username,
        message: `${username} has left the chat`
      });
    });

    // Handle disconnect — check if the creator left
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.id}`);
      const userInfo = socketUserMap.get(socket.id);
      socketUserMap.delete(socket.id);

      if (!userInfo) return;
      const { roomId, username } = userInfo;

      try {
        const room = await Room.findOne({ roomId });
        if (!room) return;

        // Notify others about user leaving
        io.to(roomId).emit('user_left', {
          username,
          message: `${username} has left the chat`
        });

        // If it was the creator, start the 5-minute countdown
        if (room.creator === username) {
          console.log(`Creator "${username}" disconnected from room ${roomId}. Starting 5-min deletion timer.`);

          // Warn remaining users immediately
          io.to(roomId).emit('host_disconnected', {
            message: `⚠️ Host "${username}" disconnected. Room will be deleted in 5 minutes unless they rejoin.`,
            secondsRemaining: CREATOR_DISCONNECT_GRACE_MS / 1000
          });

          const timer = setTimeout(async () => {
            console.log(`Deleting room ${roomId} — creator never rejoined.`);
            await Room.deleteRoom(roomId);
            io.to(roomId).emit('room_deleted', {
              message: '🚫 The host did not return. This room has been deleted.'
            });
            creatorTimers.delete(roomId);
          }, CREATOR_DISCONNECT_GRACE_MS);

          creatorTimers.set(roomId, timer);
        }
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });
  });
};

module.exports = chatSocket;
