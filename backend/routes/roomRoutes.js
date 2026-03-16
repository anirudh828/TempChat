const express = require('express');
const router = express.Router();
const { createRoom, joinRoom } = require('../controllers/roomController');

// Route to create a new room
router.post('/create', createRoom);

// Route to join an existing room
router.post('/join', joinRoom);

module.exports = router;
