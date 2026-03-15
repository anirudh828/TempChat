const { getDB } = require('../config/db');

class Room {
  static async create(data) {
    const db = getDB();
    const { roomId, password, creator, expiryTime, users } = data;
    
    await db.run(
      `INSERT INTO rooms (roomId, password, creator, expiryTime, createdAt, users, messages)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        roomId, 
        password, 
        creator, 
        expiryTime.getTime(), 
        Date.now(), 
        JSON.stringify(users || []), 
        JSON.stringify([])
      ]
    );
    
    return this.findOne({ roomId });
  }

  static async findOne({ roomId }) {
    const db = getDB();
    const row = await db.get('SELECT * FROM rooms WHERE roomId = ?', [roomId]);
    
    if (!row) return null;
    
    return {
      roomId: row.roomId,
      password: row.password,
      creator: row.creator,
      expiryTime: new Date(row.expiryTime),
      get isExpired() {
        return Date.now() > this.expiryTime.getTime();
      },
      createdAt: new Date(row.createdAt),
      users: JSON.parse(row.users),
      messages: JSON.parse(row.messages),
      // Mock Mongoose save
      async save() {
        await db.run(
          'UPDATE rooms SET users = ?, messages = ? WHERE roomId = ?',
          [JSON.stringify(this.users), JSON.stringify(this.messages), this.roomId]
        );
      }
    };
  }

  // Helper method for sockets since $push is Mongoose specific
  static async addMessage(roomId, message) {
    const room = await this.findOne({ roomId });
    if (room) {
      room.messages.push(message);
      await room.save();
    }
  }

  // Hard-delete a room from the database
  static async deleteRoom(roomId) {
    const db = getDB();
    await db.run('DELETE FROM rooms WHERE roomId = ?', [roomId]);
  }
}

module.exports = Room;
