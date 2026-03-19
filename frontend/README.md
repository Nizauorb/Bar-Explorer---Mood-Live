# Bar Explorer - Mood Live 🍻

Application mobile/web pour découvrir les meilleurs bars en temps réel selon l'ambiance du moment.

## 🎯 Fonctionnalités principales

### MVP Implémenté

- **🗺️ Carte interactive** avec Leaflet affichant tous les bars de la ville
- **🔥 Heatmap en temps réel** basée sur l'ambiance et l'affluence
- **👤 Authentification** (Email + Google OAuth mockée)
- **⭐ Système de votes** pour l'ambiance (0-5) et l'affluence (faible/moyenne/pleine)
- **❤️ Favoris** (maximum 3 bars par utilisateur)
- **👥 Liste d'amis** avec "meilleur ami" en vedette
- **📍 Géolocalisation** optionnelle
- **🔍 Recherche et filtres** de bars
- **📱 Design responsive** mobile et tablette

## 🎨 Charte graphique

L'application utilise une palette de couleurs violet/bleu inspirée du design system fourni :

- **Primary** : #8A7CF5 (Violet clair)
- **Secondary** : #65498D (Violet foncé)
- **Surface Dark** : #1A1B2E (Noir bleuté)
- **Surface Light** : #FFFFFF (Blanc)
- **Surface Background** : #E8EBF5 (Gris-bleu clair)

## 🏗️ Architecture technique

### Stack

- **Frontend** : React + TypeScript + Tailwind CSS v4
- **Routing** : React Router v7
- **Carte** : Leaflet + React-Leaflet
- **Icônes** : Lucide React
- **Notifications** : Sonner

### Structure des données

**User**

- ID, email, pseudo, avatar
- Préférences musicales et fréquence de sortie
- Liste de favoris (max 3)
- Liste d'amis

**Bar**

- Informations de base (nom, adresse, coordonnées)
- Tags et description
- Ambiance actuelle (0-5)
- Affluence (faible/moyenne/pleine)
- Nombre de votes

**Vote**

- Utilisateur, Bar, Ambiance, Affluence
- Timestamp

## 📱 Pages

### `/` - Connexion/Inscription

- Authentification par email ou Google
- Toggle connexion/inscription
- Récupération de mot de passe

### `/map` - Carte principale

- Carte interactive plein écran
- Markers colorés selon l'ambiance
- Heatmap visuelle avec cercles
- Barre de recherche
- Filtres (ambiance, budget, style musical)
- Accès rapide au profil et liste d'amis

### `/profile` - Profil utilisateur

- Affichage et édition du profil
- Préférences musicales
- Fréquence de sortie
- Bars favoris (max 3)
- Déconnexion

### `/friends` - Liste d'amis

- "Meilleur ami" mis en avant
- Statut en ligne/hors ligne
- Position actuelle (bar)
- Recherche d'amis
- Ajout de nouveaux amis

## 🎮 Fonctionnement

### Heatmap

La carte utilise un code couleur pour représenter l'ambiance :

- 🔴 **Rouge** (4-5) : Ambiance de folie
- 🟠 **Orange** (3-4) : Très animé
- 🟡 **Jaune** (2-3) : Agréable
- 🟢 **Vert** (0-2) : Calme

### Système de votes

- Les utilisateurs connectés peuvent voter sur l'ambiance (curseur 0-5) et l'affluence (3 niveaux)
- Limitation : 1 vote toutes les 15 minutes
- Géofencing : vote autorisé uniquement à proximité du bar
- Calcul en temps réel de la moyenne pondérée

### Favoris

- Maximum 3 bars favoris par utilisateur
- Visibles sur le profil
- Accès rapide depuis la carte

## 🔮 Évolutions futures

- Intégration d'une vraie API backend (Node.js + Express)
- Base de données MySQL avec Sequelize
- WebSocket temps réel avec Socket.IO
- PWA pour installation sur mobile
- Notifications push
- Partage de position avec amis
- Suggestion automatique de bars
- Nouveaux types d'ambiance (concerts, quiz, afterwork)
- Niveau sonore et temps d'attente au bar

## 🚀 Développement

```bash
# Installation des dépendances
npm install

# Lancement en développement
npm run dev

# Build de production
npm run build
```

## 📝 Notes techniques

- Les données sont actuellement mockées dans `/src/app/data/mockData.ts`
- L'authentification est simulée (pas de vérification réelle)
- Les votes sont stockés en mémoire locale (pas de persistance)
- La géolocalisation est simulée

## 👥 Personas ciblés

- **Lucas (22 ans)** - Étudiant cherchant l'ambiance
- **Anna (28 ans)** - Touriste découvrant les lieux locaux
- **Maxime (31 ans)** - Célibataire à la recherche de rencontres
- **Hugo (25 ans)** - Barman cherchant du travail

---

Développé avec ❤️ pour Figma Make