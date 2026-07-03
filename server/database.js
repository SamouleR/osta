const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'osta.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données:', err.message);
  } else {
    console.log('Connecté à la base de données SQLite.');
  }
});

db.serialize(() => {
  // Table Utilisateurs
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    address TEXT,
    postal_code TEXT,
    city TEXT,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Table Commandes
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total_price REAL NOT NULL,
    status TEXT DEFAULT 'en attente',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Table Articles Commandés
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_name TEXT NOT NULL,
    size TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY(order_id) REFERENCES orders(id)
  )`);
});

module.exports = db;
