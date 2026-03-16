const mongoose = require('mongoose');

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
  users: {
    type: [String],
    default: []
  },
  messages: {
    type: Array,
    default: []
  }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Virtual to check if room is expired
roomSchema.virtual('isExpired').get(function() {
  return Date.now() > this.expiryTime.getTime();
});

// Helper method for socket logic to add a message
roomSchema.statics.addMessage = async function(roomId, message) {
  await this.updateOne(
    { roomId },
    { $push: { messages: message } }
  );
};

// Remove a user from the room (used during disconnects)
roomSchema.statics.removeUser = async function(roomId, username) {
  await this.updateOne(
    { roomId },
    { $pull: { users: username } }
  );
};

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
