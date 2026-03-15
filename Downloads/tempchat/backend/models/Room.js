const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: String,
  text: String,
  timestamp: Date,
  reactions: {
    type: Map,
    of: Number,
    default: {}
  }
}, { _id: false });

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  creator: {
    type: String,
    required: true
  },
  expiryTime: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  users: {
    type: [String],
    default: []
  },
  messages: {
    type: [messageSchema],
    default: []
  }
});

// Virtual for checking if room is expired
roomSchema.virtual('isExpired').get(function() {
  return Date.now() > this.expiryTime.getTime();
});

// Helper static method for sockets
roomSchema.statics.addMessage = async function(roomId, message) {
  const room = await this.findOne({ roomId });
  if (room) {
    room.messages.push(message);
    await room.save();
  }
};

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
