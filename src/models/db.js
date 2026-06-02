const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join('/data', 'taxi.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS rides (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    pickup TEXT NOT NULL,
    destination TEXT NOT NULL,
    status TEXT DEFAULT 'requested',
    fare INTEGER NOT NULL,
    driver_name TEXT DEFAULT 'Rajan Kumar',
    driver_phone TEXT DEFAULT '+91 98765 43210',
    driver_vehicle TEXT DEFAULT 'TN 01 AB 1234',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

module.exports = db;
