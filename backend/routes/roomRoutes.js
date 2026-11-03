const express = require('express');
const router = express.Router();
const { createRoom, joinRoom, getRoomInfo } = require('../controllers/roomController');

// Route to create a new room
router.post('/create', createRoom);

// Route to join an existing room
router.post('/join', joinRoom);

// Route to get public info about a room
router.get('/:roomId', getRoomInfo);

module.exports = router;
