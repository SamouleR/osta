const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- ROUTES AUTHENTIFICATION ---

// Inscription
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, address, postal_code, city, phone } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  db.run(
    `INSERT INTO users (name, email, password, address, postal_code, city, phone) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
    [name, email, password, address, postal_code, city, phone], 
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Cet email est déjà utilisé' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, name, email, address, postal_code, city, phone });
    }
  );
});

// Connexion
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Identifiants incorrects' });
    
    res.json({ 
      id: user.id, 
      name: user.name, 
      email: user.email,
      address: user.address,
      postal_code: user.postal_code,
      city: user.city,
      phone: user.phone
    });
  });
});

// Mise à jour profil
app.put('/api/auth/user/:id', (req, res) => {
  const { id } = req.params;
  const { address, postal_code, city, phone } = req.body;
  
  db.run(
    `UPDATE users SET address = ?, postal_code = ?, city = ?, phone = ? WHERE id = ?`,
    [address, postal_code, city, phone, id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});


// --- ROUTES COMMANDES ---

// Créer une commande
app.post('/api/orders', (req, res) => {
  const { userId, items, totalPrice } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Panier vide' });
  }

  // Création de la commande principale
  db.run(`INSERT INTO orders (user_id, total_price) VALUES (?, ?)`, [userId || null, totalPrice], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    const orderId = this.lastID;
    let itemsProcessed = 0;

    // Insertion des articles
    items.forEach(item => {
      db.run(
        `INSERT INTO order_items (order_id, product_name, size, price, quantity) VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.name, item.size, item.price, item.quantity],
        (err) => {
          if (err) console.error('Erreur insertion article:', err.message);
          
          itemsProcessed++;
          if (itemsProcessed === items.length) {
            res.json({ success: true, orderId, message: 'Commande validée avec succès' });
          }
        }
      );
    });
  });
});

// Récupérer les commandes d'un utilisateur
app.get('/api/orders/:userId', (req, res) => {
  const { userId } = req.params;
  
  db.all(`SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`, [userId], (err, orders) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(orders);
  });
});

app.listen(PORT, () => {
  console.log(`Serveur OSTA démarré sur http://localhost:${PORT}`);
});
