const Room = require('../models/Room');
const { v4: uuidv4 } = require('uuid');

// @desc    Create a new room
// @route   POST /api/rooms/create
// @access  Public
const createRoom = async (req, res) => {
  try {
    const { roomId: customRoomId, username, password, expiryMinutes } = req.body;

    // Validate input
    if (!username || !password || !expiryMinutes) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    let finalRoomId;

    // If Custom Room ID is provided, use it and check if it already exists
    if (customRoomId) {
      const existingRoom = await Room.findOne({ roomId: customRoomId });
      if (existingRoom) {
        return res.status(400).json({ message: 'That Room ID is already in use' });
      }
      finalRoomId = customRoomId;
    } else {
      // Generate unique random room ID otherwise
      finalRoomId = uuidv4().substring(0, 8); 
    }

    // Calculate expiry time
    const expiryTime = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Create room in database
    const room = await Room.create({
      roomId: finalRoomId,
      password,
      creator: username,
      expiryTime,
      users: [username] // Add creator as the first user
    });

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      room: {
        roomId: room.roomId,
        creator: room.creator,
        expiryTime: room.expiryTime
      }
    });

  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error while creating room' });
  }
};

// @desc    Join an existing room
// @route   POST /api/rooms/join
// @access  Public
const joinRoom = async (req, res) => {
  try {
    const { roomId, username, password } = req.body;

    // Validate input
    if (!roomId || !username || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Find room
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check password
    if (room.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Check expiry
    if (room.isExpired) {
      return res.status(400).json({ message: 'This room has expired' });
    }

    // Check if username already exists in room
    if (room.users.includes(username)) {
      return res.status(400).json({ message: 'Username is already taken in this room' });
    }

    // Add user to room
    room.users.push(username);
    await room.save();

    res.status(200).json({
      success: true,
      message: 'Joined room successfully',
      room: {
        roomId: room.roomId,
        creator: room.creator,
        expiryTime: room.expiryTime,
        messages: room.messages
      }
    });

  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ message: 'Server error while joining room' });
  }
};

module.exports = {
  createRoom,
  joinRoom
};
