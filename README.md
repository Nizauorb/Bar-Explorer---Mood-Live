# Bar Explorer - Mood Live

Application web/mobile permettant de trouver les bars selon l'ambiance en temps réel via un système participatif de votes.

## 📁 Structure du projet

```
Bar Explorer - Mood Live/
├── .gitignore           # Configuration Git globale
├── .env.example         # Modèle de variables d'environnement
├── README.md            # Documentation du projet
├── bar-explorer-design-system.css  # Design system CSS
├── apache-config/       # Configuration Apache pour production
├── backend/             # API Node.js + Express + TypeScript
├── frontend/            # Application React + TypeScript
├── docker-compose.yml   # Conteneurs Docker
└── schema.sql           # Schéma de base de données
```

## 🌐 Versions et Releases

- **v1.0.0-auth** : Version fonctionnelle complète avec authentification ✅
  - Disponible sur GitHub avec tag `v1.0.0-auth`
  - Backend Node.js + Express + Sequelize + MySQL
  - Frontend React avec carte interactive Leaflet
  - Système d'authentification JWT complet

## 🔄 Workflow Git Professionnel

Le projet utilise un workflow Git de type "GitFlow" :

```bash
main                    # Version stable et fonctionnelle
├── develop            # Branche d'intégration des features
├── feature/nom-feature # Développement de chaque feature
├── release/vX.Y.Z     # Préparation des releases
└── hotfix/fix-urgent  # Corrections critiques
```

### Processus de développement

1. **Créer une feature** : `git checkout -b feature/systeme-vote`
2. **Développer** → **Tester** → **Valider**
3. **Merger dans develop** : `git checkout develop && git merge feature/systeme-vote`
4. **Après plusieurs features** → Créer release : `git checkout -b release/v1.1.0`
5. **Tester** → **Merger dans main** + **Tag** + **Release GitHub**

## 🚀 Stack technique

- **Frontend** : React + TypeScript + Vite + Tailwind CSS + Leaflet
- **Backend** : Node.js + Express + TypeScript + Sequelize + MySQL
- **Temps réel** : Socket.io
- **Authentification** : JWT
- **Déploiement** : Docker + Apache
- **Base de données** : MySQL (local/Docker)

## 📱 Fonctionnalités MVP

- 🗺️ Carte interactive avec heatmap temps réel
- 🗳️ Système de votes (ambiance 0-5, affluence)
- 👤 Authentification et profil utilisateur
- 📍 Géolocalisation et filtres
- 👥 Social (amis, partage position)
- ⭐ Favoris (max 3 bars)

## 🛠️ Installation et démarrage

### Prérequis
- Node.js 18+
- MySQL 8+ ou Docker
- Git

### Installation

1. **Cloner le projet** :
```bash
git clone https://github.com/Nizauorb/Bar-Explorer---Mood-Live.git
cd Bar-Explorer---Mood-Live
```

2. **Configurer l'environnement** :
```bash
cp .env.example .env
# Éditer .env avec vos configurations
```

3. **Installer les dépendances** :
```bash
# Backend
cd backend && npm install

# Frontend  
cd ../frontend && npm install
```

4. **Démarrer avec Docker** (recommandé) :
```bash
docker-compose up -d
```

5. **Ou démarrer manuellement** :
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### 🎨 Design System

Le projet utilise un design system personnalisé défini dans `bar-explorer-design-system.css` avec :
- Couleurs primaires violettes
- Typographie Inter
- Composants UI cohérents

## 📋 Développement - État actuel

Le développement suit une approche étape par étape :

**✅ Fondations terminées** :
- Structure du projet professionnelle avec workflow Git
- Frontend React + Vite + Tailwind configuré
- Intégration design system complète
- Backend Node.js + Express + TypeScript
- Base de données MySQL + Sequelize
- Modèles et seeders complets
- Routes API de base
- Authentification JWT complète
- Page principale avec carte interactive Leaflet
- Affichage des bars sur la carte avec marqueurs

**🔄 En cours** :
- Système de vote (ambiance 0-5, affluence)

**⏳ À venir** :
- Popup bar (informations détaillées)
- Filtres (ambiance, budget, style musical)
- Page profil + favoris
- Système d'amis
- Partage de position "Rejoignez-moi"
- Socket.io (heatmap temps réel)

## 🗄️ Base de données

- **Modèles** : User, Bar, Vote, Favorite avec relations complètes
- **Seeders** : Données de démo (3 utilisateurs, 5 bars, votes, favoris)
- **Scripts** : `npm run db:migrate`, `npm run db:seed`, `npm run db:reset`

## 🔐 Authentification

- **JWT** : Tokens avec expiration configurable
- **Endpoints** : `/api/auth/register`, `/api/auth/login`, `/api/auth/profile`
- **Sécurité** : Hashing passwords, validation complète, middleware de protection
- **Middleware** : `authenticateToken()` pour routes protégées, `optionalAuth()` optionnel

## 📝 Contribuer

Le projet suit des règles strictes de développement :

1. **Approche étape par étape** : Chaque feature est développée séparément
2. **Workflow Git** : Utilisation des branches feature/release/main
3. **Tests et validation** : Chaque feature doit être testée avant merge
4. **Documentation** : README et commentaires maintenus à jour
5. **Clean code** : Code lisible, maintenable et bien structuré

### 🚀 Prochaine feature : Système de vote

Pour commencer le développement du système de vote :

```bash
git checkout develop
git checkout -b feature/systeme-vote
```

**Objectifs** :
- Interface de vote (ambiance 0-5, affluence)
- API backend pour les votes
- Mise à jour temps réel des marqueurs
- Validation et anti-abus

---

**Bar Explorer - Mood Live** - Trouve le bar parfait selon l'ambiance du moment ! 🍺✨
