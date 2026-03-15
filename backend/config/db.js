const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let dbInstance = null;

const connectDB = async () => {
  try {
    const db = await open({
      filename: './tempchat.db',
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
