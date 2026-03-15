const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const fs = require('fs');
const path = require('path');

let dbInstance = null;

const connectDB = async () => {
  try {
    // Ensure the data directory exists for persistent storage
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, 'tempchat.db');

    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // Create Rooms table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        roomId TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        creator TEXT NOT NULL,
        expiryTime INTEGER NOT NULL,
        createdAt INTEGER NOT NULL,
        users TEXT NOT NULL,
        messages TEXT NOT NULL
      )
    `);
    
    console.log('SQLite Database Connected & Initialized');
    dbInstance = db;
    return db;
  } catch (error) {
    console.error(`Error connecting to SQLite: ${error.message}`);
    process.exit(1);
  }
};

const getDB = () => dbInstance;

module.exports = { connectDB, getDB };
