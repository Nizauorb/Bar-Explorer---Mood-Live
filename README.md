# Bar Explorer - Mood Live

Application web/mobile permettant de trouver les bars selon l'ambiance en temps réel via un système participatif de votes.

## 📁 Structure du projet

```
bar-explorer-mood-live/
├── frontend/          # React + TypeScript + Vite + Tailwind
├── backend/           # Node.js + Express + TypeScript + Sequelize
├── shared/            # Types et utilitaires communs
├── docs/              # Documentation et cahier des charges
└── bar-explorer-design-system.css  # Design system CSS
```

## 🚀 Stack technique

- **Frontend** : React + TypeScript + Vite + Tailwind CSS + Mapbox
- **Backend** : Node.js + Express + TypeScript + Sequelize + MySQL
- **Temps réel** : Socket.io
- **Authentification** : JWT
- **Déploiement** : Vercel (front) + Render (back)

## 📱 Fonctionnalités MVP

- 🗺️ Carte interactive avec heatmap temps réel
- 🗳️ Système de votes (ambiance 0-5, affluence)
- 👤 Authentification et profil utilisateur
- 📍 Géolocalisation et filtres
- 👥 Social (amis, partage position)
- ⭐ Favoris (max 3 bars)

## 🎨 Design System

Le projet utilise un design system personnalisé défini dans `bar-explorer-design-system.css` avec :
- Couleurs primaires violettes
- Typographie Inter
- Composants UI cohérents

## 📋 Développement

Le développement suit une approche étape par étape :
1. Structure du projet ✅
2. Frontend React + Vite + Tailwind ✅
3. Intégration design system ✅
4. Backend Node.js + Express ✅
5. Base de données MySQL + Sequelize ✅
6. Modèles et seeders ✅
7. Routes API de base
8. Authentification JWT

### 🎯 État actuel

**Frontend** : 
- ✅ React + TypeScript + Vite configuré
- ✅ Tailwind CSS intégré avec design system
- ✅ Design system CSS complètement intégré (tokens, composants)
- ✅ PostCSS configuré et serveur dev fonctionnel
- ✅ Structure de base avec composants Bar Explorer

**Backend** :
- ✅ Node.js + Express + TypeScript configuré
- ✅ Sequelize ORM avec MySQL configuré
- ✅ Modèles complets (User, Bar, Vote, Favorite) avec associations
- ✅ Seeders de démonstration (utilisateurs, bars, votes, favoris)
- ✅ Scripts de gestion de base de données (migrate, seed, reset)
- ✅ Socket.io configuré pour temps réel
- ✅ Serveur dev fonctionnel sur port 3000

**Base de données** :
- ✅ Configuration MySQL avec Sequelize
- ✅ Modèles typés avec TypeScript
- ✅ Seeders avec données de démonstration
- ✅ Scripts de migration et peuplement

**Prochaines étapes** :
- Mettre en place les routes API de base (auth, users, bars)
- Implémenter l'authentification JWT + inscription/connexion
- Créer les composants frontend selon les mockups

### 🎨 Design System intégré

- **Tokens CSS** : Couleurs primaires violettes, surfaces, typographie
- **Composants** : Boutons `.be-btn-primary`, `.be-btn-secondary`, cards `.be-card`
- **Typographie** : Classes `.be-heading-*`, `.be-body`, `.be-caption`
- **Thème** : Cohérent avec les mockups mobiles (authentification, profil)

### 🗄️ Base de données

- **Modèles** : User, Bar, Vote, Favorite avec relations complètes
- **Seeders** : Données de démo (3 utilisateurs, 5 bars, votes, favoris)
- **Scripts** : `npm run db:migrate`, `npm run db:seed`, `npm run db:reset`
