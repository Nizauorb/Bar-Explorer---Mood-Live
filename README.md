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
3. Intégration design system
4. Backend Node.js + Express
5. Base de données MySQL + Sequelize

### 🎯 État actuel

**Frontend** : 
- ✅ React + TypeScript + Vite configuré
- ✅ Tailwind CSS intégré avec design system
- ✅ Structure de base avec composants Bar Explorer
- ✅ Design system CSS importé et fonctionnel

**Prochaines étapes** :
- Intégration complète du design system
- Création des composants d'authentification
- Mise en place du backend
