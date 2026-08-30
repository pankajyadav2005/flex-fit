const Database = require('better-sqlite3');
const db = new Database('flexfit.db');

// Create the users table if it doesn't already exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    sports TEXT,
    goals TEXT,
    age INTEGER,
    height REAL,
    weight REAL,
    target_weight REAL,
    fitness_level TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);
module.exports = db;