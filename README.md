# OSTA 

OSTA est une plateforme e-commerce dédiée à la vente de vêtements éco-responsables (Tee-shirts, Pulls, Polos). Les produits sont fabriqués à partir de matériaux recyclés, dans une démarche éthique et respectueuse de l'environnement.

## 🚀 Fonctionnalités

- **Catalogue de produits** : Présentation des articles avec descriptions détaillées et gestion des tailles.
- **Panier d'achat** : Ajout d'articles, modification des quantités et calcul du total.
- **Authentification** : Inscription et connexion pour les utilisateurs.
- **Espace Compte** : Gestion des informations personnelles et de l'adresse de livraison.
- **Gestion des Commandes** : Enregistrement des commandes en base de données.
- **Design & UX** : Interface fluide, moderne et responsive, avec un écran de chargement (Loader) personnalisé.

## 🛠️ Technologies Utilisées

### Frontend
- **React 19** : Bibliothèque principale.
- **Vite** : Outil de build ultra-rapide.
- **React Router DOM** : Gestion des différentes pages (Accueil, Produit, Panier, Connexion, Compte).
- **Lucide React** : Icônes vectorielles.
- **CSS** : Styles sur-mesure pour un design unique.

### Backend
- **Node.js & Express** : Serveur API REST.
- **SQLite3** : Base de données locale légère (`osta.db`) pour stocker les utilisateurs et les commandes.

## 📁 Structure du Projet

- `/src` : Code source du Frontend (Pages, Composants React, CSS).
- `/server` : Code source du Backend (Serveur Express, Base de données SQLite).
- `/public` : Ressources statiques (images des articles, etc.).

## ⚙️ Installation et Lancement

### 1. Prérequis
Assurez-vous d'avoir [Node.js](https://nodejs.org/) installé sur votre machine.

### 2. Démarrer le Backend (API & Base de données)
Ouvrez un terminal et exécutez les commandes suivantes :
```bash
cd server
npm install
node index.js
```
Le backend sera disponible sur `http://localhost:3001`.

### 3. Démarrer le Frontend (Application Web)
Ouvrez un **nouveau** terminal à la racine du projet (`OSTA`) et exécutez :
```bash
npm install
npm run dev
```
L'application sera accessible (en général) sur `http://localhost:5173`.

## 🌿 La philosophie OSTA
En choisissant ce projet, vous soutenez un savoir-faire local, éthique et une mode qui a un impact positif sur la planète !
