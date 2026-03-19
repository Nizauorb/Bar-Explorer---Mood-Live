# **Cahier des charges**

### Sommaire — Bar Explorer – Mood Live (Cahier des charges)

1. **Introduction**
    
    1.1. Contexte et vision du projet
    
    1.2. Définitions (Mood Live, heatmap, votes, tags)
    
2. **Besoins & objectifs**
    
    2.1. Concept global
    
    2.2. Objectifs et problématiques résolues
    
    2.3. Périmètre produit (MVP vs évolutions)
    
3. **Public cible**
    
    3.1. Profils utilisateurs
    
    3.2. Cas d’usage détaillés
    
    3.3. Personas
    
4. **User stories**
    
    4.1. Légende / priorisation (MVP / versions à venir)
    
    4.2. Tableau des user stories
    
5. **Fonctionnalités (MVP)**
    
    5.1. Utilisateurs (auth, profil)
    
    5.2. Bars (fiche, données, tags)
    
    5.3. Mood Live (votes ambiance / affluence, calcul du score)
    
    5.4. Carte interactive (heatmap, filtres)
    
    5.5. Social (partage, amis)
    
    5.6. Back-end (API, temps réel, auth)
    
    5.7. Front web (consultation + admin)
    
    5.8. App mobile (client)
    
6. **Fonctionnalités détaillées par page**
    
    6.1. Page Accueil / Carte
    
    6.2. Page Fiche bar
    
    6.3. Page Vote / Contribution
    
    6.4. Page Profil / Favoris
    
    6.5. Page Social (amis, partage)
    
    6.6. Admin (CRUD bars, modération, stats)
    
7. **Évolutions potentielles**
    
    7.1. Nouveaux types d’ambiance et signaux (son, attente, etc.)
    
    7.2. Suggestions automatiques
    
    7.3. Suivi des amis / fonctionnalités avancées
    
8. **UX / Wireframes**
    
    8.1. Wireframes (lien Figma)
    
    8.2. Parcours clés (onboarding, recherche, vote)
    
9. **Charte graphique & direction artistique**
    
    9.1. Couleurs
    
    9.2. Typographies
    
    9.3. Composants UI (boutons, icônes)
    
10. **Exemples de maquettes**
    
    10.1. Écrans principaux
    
    10.2. États (vide, chargement, erreur)
    

---

### Sommaire — Spécifications techniques

1. **Technologies**
    
    11.1. Stack MVP (front, back, BDD, mobile)
    
    11.2. Outils et librairies clés
    
2. **Supports compatibles**
    
    12.1. Navigateurs web
    
    12.2. Mobile
    
    12.3. Tablettes
    
3. **Déploiement**
    
    13.1. Options d’hébergement (front, back, BDD)
    
    13.2. HTTPS et contraintes réseau
    
4. **Base de données**
    
    14.1. Modèle conceptuel (MCD)
    
    14.2. Entités et relations (User, Bar, Vote, Favoris)
    
5. **Routes / API**
    
    15.1. Endpoints Auth
    
    15.2. Endpoints Users
    
    15.3. Endpoints Bars
    
    15.4. Endpoints Votes
    
    15.5. Endpoints Favoris
    
    15.6. Temps réel (WebSocket)
    
6. **Sécurité & justifications techniques**
    
    16.1. Justification des choix (Node, WebSocket, MySQL, Leaflet)
    
    16.2. Mesures de sécurité (bcrypt, JWT, rate limiting, anti-spam, géofencing)
    

---

1. **Conclusion**
2. **Annexes**
    
    18.1. Glossaire
    
    18.2. Références et liens
    
    18.3. Éléments à compléter
    

---

## I - Besoins et Objectifs

### 🎯 Concept global

Une application web/mobile permettant aux utilisateurs de trouver le bar le plus adapté à leur envie du moment, non pas sur de simples avis statiques, mais selon l'ambiance en temps réel, indiquée par les personnes actuellement sur place.

L'ambiance est mesurée via un système participatif (votes, curseurs, tags) et affichée sous forme de heatmap sur une carte de la ville.

> ⚠️ L'information est vivante → ça change au cours de la soirée.
> 

### 🎯 Écosystème technique

Créer un **écosystème web complet** :

- API web (backend)
- Interface mobile (client)
- Front web (consultation/admin)
- Base de données relationnelle

### 💡 Objectifs et problématiques résolues

| **Problème courant** | **Solution proposée** |
| --- | --- |
| On ne sait jamais quel bar est animé / calme / bondé | Heatmap dynamique selon ambiance + fréquentation |
| Les avis Google ne reflètent pas l'ambiance du moment | Votes en temps réel de personnes présentes |
| Se décider en soirée = perte de temps | Filtre instantané → DJ, chill, rock, blind test, bière artisanale… |
| Difficile de se regrouper avec des potes dispersés | Système de position partagée + points de rencontre |

---

## II - Public cible

### Profils utilisateurs

- **Les gens qui vont dans les bars** (+++)
- **Âge** : 18 - 30 ans (++) | 31 - 50 ans (+)
- **Les étudiants** (+++)
- **Les barman et serveurs** (++)
- **Les touristes** (+)

### Cas d'usage détaillés

**Le célibataire**

Il veut faire des rencontres dans les bars et se dirigera dans un bar où il y a de l'affluence. Sur l'app, il peut voir en temps réel les bars animés. Si un bar organise une soirée spéciale comme "Speed Dating", il sera au courant grâce à l'app. Une fois sur place, il pourra indiquer aux autres utilisateurs l'ambiance de la soirée.

**Le touriste**

Il veut pouvoir être conseillé correctement sur les lieux fréquentés par les locaux afin de s'intégrer plus facilement. Il va également noter les bars avec le plus de justesse possible, pour guider les autres touristes vers les bons endroits de la ville. Afin qu'il ne se retrouve pas dans un vieux bar tabac PMU lors de ses vacances. S'il est fumeur, il pourra justement trouver les bars tabacs qui sont bien vus.

**L'étudiant**

Il veut pouvoir voir où il y a le plus d'ambiance à un instant T afin de retrouver ses amis ou s'en faire de nouveaux. S'il cherche plutôt un bar à bière qui n'est pas trop cher, il pourra facilement le trouver sur l'app.

**Le barman/serveur**

Il cherche un nouveau travail et pourra aller voir sur l'app le bar qui lui correspond le plus à sa recherche grâce au filtre de recherche, et ainsi aller postuler sur place.

**L'habitué du bar**

Il veut savoir s'il y a du monde dans son bar préféré au moment où il veut sortir, ou s'il y a une soirée spéciale dans un bar de sa ville. Si ses amis sont également des habitués, il veut pouvoir les inviter à le rejoindre afin de boire un verre ensemble.

### Personas

**Persona 1 : Lucas – 22 ans – Étudiant**

- **Besoin** : trouver rapidement un bar animé avec ses amis
- **Usage** : filtre "Ambiance forte", filtre "Prix bas", Heatmap

**Persona 2 : Anna – 28 ans – Touriste**

- **Besoin** : éviter les lieux touristiques "vides", vivre les lieux locaux
- **Usage** : classement des bars populaires → votes en instantané

**Persona 3 : Maxime – 31 ans – Célibataire**

- **Besoin** : chercher "où ça bouge" pour faire des rencontres
- **Usage** : affluence, soirées spéciales (DJ, speed-dating…)

**Persona 4 : Hugo – 25 ans – Barman**

- **Besoin** : découvrir les bars vivants pour trouver un emploi
- **Usage** : fiche bar, contact, style musical, affluence habituelle

---

## III - Users Stories

### Légende

- **MVP** : Fonctionnalité prioritaire

| **En tant que** | **Je souhaite** | **Afin de** |
| --- | --- | --- |
| Visiteur | Pouvoir me créer un compte utilisateur sur la plateforme | Accéder à l'ensemble des fonctions sociales de l'application et participer au système de vote |
| Utilisateur | Accéder à mon profil personnel | Consulter et modifier mes informations personnelles et mes préférences |
| Utilisateur | Visualiser une carte interactive affichant les bars situés autour de ma position géographique | Pouvoir choisir facilement où me rendre en fonction de la proximité |
| Utilisateur | Appliquer différents filtres de recherche | Affiner et personnaliser ma recherche de bars selon mes critères spécifiques |
| Utilisateur | Consulter une heatmap représentant l'affluence des établissements | Connaître l'intensité de la fréquentation en temps réel dans chaque bar |
| Utilisateur | Pouvoir ajouter un bar à ma liste de favoris | Enrichir le contenu de mon profil avec mes établissements préférés |
| Utilisateur | Voter et donner mon avis sur l'ambiance actuelle ainsi que sur l'affluence | Contribuer à alimenter la heatmap et fournir des informations utiles aux autres utilisateurs |
| Utilisateur | Consulter la fiche détaillée d'un bar spécifique | Visualiser le score d'ambiance en direct, découvrir les tags associés et connaître l'affluence en temps réel |
| Utilisateur | Partager ma position géographique actuelle avec d'autres utilisateurs | Faciliter le processus pour inviter mes amis à me rejoindre dans l'établissement où je me trouve |
| Utilisateur | Accéder à ma liste d'amis sur l'application | Gérer mes contacts, ajouter de nouveaux amis et interagir avec mon réseau social |
| Administrateur | Me connecter sur le dashboard | Modifier les informations auquel auront accès les utilisateurs et modéré les actions qu’il réaliseront en cas de spam |
| Administrateur | Accéder aux fiches détaillés des bars | Effectuer diverse modification en cas d’erreur |

---

## IV - Fonctionnalités principales (MVP)

### Utilisateurs

- Authentification (Google, mail)
- Profil simple : pseudo, fréquence de sortie, préférences musicales, bar préféré

### Bars

- Fiche détaillée : adresse, prix moyen, type d'ambiance
- Score d'ambiance live calculé en continu (moyenne votes)
- Fiche du personnel, notation possible faite par les clients pour des avis direct

### Mood Live

Les utilisateurs présents dans le bar peuvent voter sur :

- **Ambiance générale** : 0 → calme | 5 → fiesta 🔥
- **Affluence estimée** : faible / moyenne / pleine

### Carte interactive

- Heatmap visuelle : couleurs selon l'intensité de la soirée
- Filtres : ambiance / budget / affluence / style musical

### Fonction sociale

- Partager ton bar actuel → « Rejoignez-moi ! »

### Back-end

- API REST pour bars, votes, utilisateurs, favoris
- Système temps réel via WebSocket ([Socket.io](http://Socket.io))
- Calcul live de l'ambiance (moyenne pondérée)
- Historique des votes
- Authentification JWT ou OAuth (Google)

### Front web

- Carte interactive (Leaflet) connectée à l'API
- Liste et fiche détaillée d'un bar
- Connexion, Profil, Favoris
- Dashboard Admin (liste, création, modification, statistiques)

### App mobile (client)

- Connexion à l'API web
- Envoi des votes en temps réel
- Visualisation de la heatmap

---

## V - Fonctionnalités détaillées par page

Les fonctionnalités ci-dessous décrivent le comportement attendu **page par page (MVP)**, à partir du périmètre défini.

### 5.1. Page Connexion / Inscription / Mot de passe oublié

#### Objectif

Permettre à un visiteur de créer un compte ou de se connecter afin d’accéder aux fonctionnalités nécessitant un compte (profil, vote, amis, partage).

#### Fonctionnalités

- **Connexion (mail + mot de passe)**
    - Saisie email et mot de passe.
    - Validation des champs (format email, champs requis).
    - Connexion et redirection vers la **Main Page (Carte)**.
- **Connexion via Google**
    - Authentification via Google.
    - Création/association automatique du compte utilisateur.
    - Redirection vers la **Main Page (Carte)**.
- **Inscription (mail)**
    - Création d’un compte via email + mot de passe.
    - Après inscription, l’utilisateur est connecté et redirigé vers la **Main Page (Carte)**.
- **Mot de passe oublié**
    - Saisie de l’email.
    - Envoi d’un lien ou d’instructions de réinitialisation.

#### Règles d’accès

- Les pages d’authentification sont accessibles aux visiteurs non connectés.
- Les pages “vote”, “profil”, “amis” nécessitent un utilisateur connecté.

---

### 5.2. Main Page (Carte)

#### Objectif

Afficher une **carte interactive** (style Snapchat) qui permet de repérer les bars et de consulter l’ambiance en direct (heatmap), puis d’ouvrir une popup détaillée sur un bar.

#### Composition de l’écran (UI)

- **Carte plein écran** au centre.
- **Icône (haut gauche)** : accès à la **Page Profil**.
- **Icône (haut droite)** : activer / désactiver la **localisation**.
- **Zone de contrôles en bas** :
    - **Icône “amis”** : accès à la **Page Liste d’amis**.
    - **Barre de recherche** : rechercher un bar et le localiser sur la carte.
    - **Icône “filtres”** : ouvrir les filtres de recherche.

#### Fonctionnalités

- **Affichage des bars sur la carte**
    - Les bars sont visibles directement sur la carte (pas de page “liste des bars”).
    - La sélection d’un bar ouvre la **popup du bar**.
- **Heatmap d’intensité**
    - Une heatmap colorée représente l’intensité de la soirée en fonction des votes (ambiance/affluence).
    - La heatmap se met à jour au fil du temps.
- **Recherche de bars**
    - La barre de recherche permet de trouver un bar et de le mettre en évidence sur la carte.
- **Filtres**
    - Filtres disponibles : **ambiance**, **budget**, **affluence**, **style musical**.
    - Les filtres impactent l’affichage des bars et de la heatmap.
- **Localisation**
    - L’utilisateur peut activer ou désactiver la localisation.
    - La localisation est utilisée pour la navigation sur la carte et pour les fonctionnalités sociales (si activée).

---

### 5.3. Popup Bar (fiche rapide)

#### Objectif

Donner une vue détaillée d’un bar depuis la carte et permettre les actions principales (favoris, vote, lecture des infos).

#### Contenu affiché

- **Nom du bar** (en haut au centre).
- **Icône “favori”** (à droite du nom) : ajouter/retirer le bar des favoris (max 3).
- **Icône “fermer”** (à gauche du nom).
- **Image du bar**.
- **Tags du bar** (issus de Google).
- **Description structurée** (issus de Google) comprenant :
    - horaires d’ouverture / fermeture
    - services disponibles
    - fourchette de prix par personne
- **Affluence estimée** : faible / moyenne / pleine.
- **Ambiance générale** : moyenne globale sur une échelle 0 → 5.

#### Gestion des informations manquantes

- Si les informations Google sont insuffisantes, la zone “description” affiche un **message indiquant qu’il manque des informations**.

#### Actions disponibles

- **Mettre en favori**
    - Un utilisateur peut avoir **3 bars maximum** en favoris.
    - Les favoris sont visibles sur le profil (par soi et par les autres).
- **Voter**
    - Un bouton “Voter” ouvre la **popup de vote**.

---

### 5.4. Popup Vote / Contribution (Mood Live)

#### Objectif

Permettre à un utilisateur connecté de contribuer à l’ambiance en direct en votant sur un bar.

#### Fonctionnalités

- Saisie d’un vote sur :
    - **Ambiance générale** (0 → 5)
    - **Affluence estimée** (faible / moyenne / pleine)
- Validation et envoi du vote.

#### Règles métier

- **Accès** : vote autorisé uniquement pour un **utilisateur connecté**.
- **Fréquence** : **1 vote par personne toutes les 15 minutes**.
- **Géofencing** : vote autorisé uniquement si l’utilisateur est dans un **rayon approximatif** autour du bar.
- **Immuabilité** : un vote ne peut pas être modifié ni annulé.
- **Historique** : pas d’historique affiché (ni de consultation dédiée).

---

### 5.5. Page Profil / Favoris

#### Objectif

Afficher et gérer les informations du compte utilisateur ainsi que ses favoris.

#### Composition de l’écran (UI)

- **Avatar** avec action pour modifier l’avatar.
- **Username** affiché en haut.
- **Icône (haut gauche)** : passer en mode **édition du profil**.
- **Icône (haut droite)** : revenir à la **Main Page (Carte)**.
- **Informations du compte** affichées au centre.

#### Fonctionnalités

- **Afficher les informations du profil**
    - pseudo
    - fréquence de sortie
    - préférences musicales
- **Éditer le profil**
    - passage en mode édition.
    - mise à jour des informations.
- **Favoris (max 3)**
    - affichage des **3 bars favoris**.
    - favoris visibles par l’utilisateur et par les autres.
    - gestion des favoris depuis la popup bar (ajout/retrait).

---

### 5.6. Page Liste d’amis

#### Objectif

Permettre à l’utilisateur de consulter et gérer sa liste d’amis.

#### Composition de l’écran (UI)

- Liste d’amis verticale.
- Le premier ami est mis en avant comme **“best friends”**.
- Barre de recherche pour filtrer/retrouver un ami.
- **Icône (haut gauche)** : retour vers la **Main Page (Carte)**.
- **Icône (haut droite)** : ajouter un ami.

#### Fonctionnalités

- **Consulter la liste d’amis**.
- **Rechercher un ami** par pseudo.
- **Ajouter un ami** via recherche du pseudo.

#### Règles sociales (localisation)

- La position de l’utilisateur peut être **visible uniquement par les amis** si la localisation est activée.

---

### 5.7. Fonction sociale — “Rejoignez-moi !”

#### Objectif

Permettre à un utilisateur d’inviter des amis à rejoindre un bar.

#### Fonctionnalités

- Envoi d’un **message automatique** de type “Rejoignez-moi !”.
- L’utilisateur renseigne le **bar dans lequel il se trouve**.

---

### 5.8. Admin (modération)

#### Objectif

Permettre à un administrateur de modérer les informations affichées aux utilisateurs, sans altérer la source officielle.

#### Accès

- Un seul rôle : **Administrateur**.

#### Fonctionnalités (MVP)

- **Signalement des informations d’un bar**
    - L’administrateur peut **signaler** :
        - les tags
        - la description (horaires, services, prix par personne)
    - L’administrateur **ne modifie pas** les données : les informations restent **100% issues de Google**.
    - Le signalement permet d’indiquer qu’une information est incorrecte ou incomplète.

#### Règles

- Les tags et la description affichés côté utilisateur proviennent de Google et sont formatés/organisés automatiquement.
- Si les informations Google sont manquantes, un message de remplacement est affiché à la place de la description.

---

## VI - Évolutions potentielles

- Type d'ambiance : chill, dansant, concert, pub, quiz, afterwork
- Niveau sonore, qualité musicale, temps d'attente au bar
- Bouton « Où aller maintenant ? » → suggestion automatique
- Voir où sont tes amis

---

## VII - Wireframes

https://www.figma.com/design/qHs23z6yjegOnhVPtYvGf3/Bar-Explorer---Mood-Live?node-id=2-6&t=ALd9Zr3R15Ly71d2-1

---

## VIII - Charte graphique et DA

La charte graphique définit l’identité visuelle du projet et garantit une cohérence sur l’ensemble de l’interface.

La palette s’organise autour d’une **couleur primaire** et d’une **couleur secondaire**, complétées par des couleurs dédiées aux **liens**, ainsi qu’aux **boutons et icônes**, avec des déclinaisons prévues pour les différents états (normal, survol, désactivé).

Enfin, la **typographie** est structurée avec une hiérarchie claire (titres, sous-titres, texte courant, légendes) pour assurer une lecture fluide et une mise en page harmonisée.

![image.png](attachment:d2e15e83-c8bb-4df2-9ace-22c66d2fc47f:image.png)

**1. Color Palette (Palette de couleurs)**
Voici la charte graphique du design system avec 7 couleurs principales : Primary (violet clair #8A7CF5), Secondary (violet foncé #65498D), Surface Dark (noir bleuté), Surface Light (blanc), Surface Background (gris-bleu clair), Text Primary (texte foncé) et Text Inverted (texte clair).

![image.png](attachment:9cc5bb82-e10e-4890-a637-e38f0701558e:image.png)

**2. Button Components (Composants de boutons)**
Cette image présente les différents états des boutons de l'interface : les boutons principaux (violet clair) et secondaires (contour violet foncé). Chaque bouton a trois états : normal, survol (hover) et désactivé (grisé).

![image.png](attachment:e78bf8b9-989a-440c-bf81-fb06b8480568:image.png)

**3. Typography Scale (Échelle typographique)**
Cette image montre la hiérarchie des textes : H1 (48px/Bold), H2 (32px/SemiBold), H3 (24px/SemiBold), Body (16px/Regular) et Caption (12px/Medium). Chaque niveau a une taille et un poids spécifiques pour structurer le contenu.

![image.png](attachment:f1623e05-8b0d-4c48-a78f-11aa6b0889a6:image.png)

**4. Input Fields (Champs de saisie)**
Présentation des trois états des champs de formulaire : Default (état normal avec bordure grise), Focus (champ actif avec bordure violette) et Error (erreur avec bordure rouge et message d'aide).

---

## IX - Exemples de maquettes

*À compléter*

---

# **Spécifications Techniques**

## I - Technologies

### Stack technique retenue (MVP)

- **Front-end** : React + TypeScript + Tailwind CSS + React Router + Leaflet + Vite
- **Back-end** : Node.js + Express + TypeScript + [Socket.IO](http://socket.io/)
- **BDD** : MySQL (via SequelizeORM) + Zod (validation)
- **Déploiement** : Vercel (front) + Render (back) + Neon (BDD)
- **Mobile** : PWA (installable sur Android/iOS via TWA/Capacitor)

---

## II - Supports compatibles

La solution **Bar Explorer – Mood Live** repose sur un backend web accessible via API REST et WebSocket. Grâce à cette architecture, le service est compatible avec un large ensemble de supports.

### Navigateurs Web (Front Web)

Le front web est développé en **React**, optimisé pour une compatibilité maximale.

**Navigateurs supportés :**

- Google Chrome (version stable)
- Mozilla Firefox
- Safari (macOS & iOS)
- Microsoft Edge
- Brave / Opera (basés sur Chromium)

**Plateformes :**

- Windows
- macOS
- Linux
- ChromeOS

⚠️ **Support IE11 : non pris en charge** (non nécessaire pour un projet moderne)

### Application Mobile (client de l'API)

Selon la stack choisie (React Native ou Flutter), l'application est compatible avec :

**Smartphones :**

- **Android** (version 8.0 "Oreo" et +)
- **iOS** (version 13 et +)

**Fonctionnalités nécessitant les permissions OS :**

- Géolocalisation GPS
- Accès réseau
- Notifications push (optionnel)

**Distribution :**

- Google Play Store
- Apple App Store
- Installation manuelle .apk (Android)
    - Tablettes Android (Samsung, Lenovo, Xiaomi…)

### Tablettes

- iPadOS (iPad Mini, Air, Pro)

Le layout s'adapte grâce à **Tailwind CSS** (responsive design) et/ou le système d'adaptive layout du framework mobile.

---

## III - Possibilités de déploiement

- **Backend** : Render / Railway / VPS
- **Front web** : Vercel / Netlify
- **Base de données** : Supabase / Neon / Railway
- **Certificat HTTPS obligatoire** (API + sockets)

---

## IV - Base de données

[Fiche explicative — MCD *Bar Explorer*](https://www.notion.so/Fiche-explicative-MCD-Bar-Explorer-321cf785feb380a699aeccb1241c7ee7?pvs=21)

[Diagramme MCD.pdf](attachment:bb427f60-3434-462f-9735-d435ab19d2c3:Diagramme_vierge_-_Diagramme_2.pdf)

https://lucid.app/lucidchart/1af6b1de-89eb-4bcc-908c-f1a5f4b7669b/edit?beaconFlowId=8C61D4E7C70DC913&invitationId=inv_37d6d686-b2ec-4100-8d14-44697ef70f85&page=yoSew5f5NTm~#

### Modèle Conceptuel de Données (MCD)

**Utilisateur**

- id
- email
- password
- pseudo
- préférences
- date_inscription

**Bar**

- id
- nom
- adresse
- latitude / longitude
- prix_moyen
- tags (array)

**Vote**

- id
- id_user
- id_bar
- ambiance (0–5)
- affluence ("faible / moyenne / pleine")
- timestamp

**Favoris**

- id_user
- id_bar

---

## V - Routes Front et Back

### Endpoints REST

**Auth**

| **Méthode** | **Route** | **Description** |
| --- | --- | --- |
| POST | /auth/register | Inscription |
| POST | /auth/login | Connexion |

**Users**

| **Méthode** | **Route** | **Description** |
| --- | --- | --- |
| GET | /users/:id | Récupérer un profil |
| PATCH | /users/:id | Modifier un profil |

**Bars**

| **Méthode** | **Route** | **Description** |
| --- | --- | --- |
| GET | /bars | Liste des bars |
| GET | /bars/:id | Fiche d'un bar |

**Votes**

| **Méthode** | **Route** | **Description** |
| --- | --- | --- |
| POST | /votes | Ajouter un vote |
| GET | /bars/:id/votes | Moyenne + historique |

**Favoris**

| **Méthode** | **Route** | **Description** |
| --- | --- | --- |
| POST | /favorites/:idBar | Ajouter un favori |
| DELETE | /favorites/:idBar | Supprimer |

---

# **Sécurité et Justifications Techniques**

## I - Justification des choix techniques

### Pourquoi Node.js ?

- Environnement JS unique → front + back = homogénéité
- Performance en temps réel grâce à l'event loop

### Pourquoi WebSocket / [Socket.io](http://Socket.io) ?

- Indispensable pour actualiser la heatmap en direct
- Gestion des rooms par bar (optimisation)

### Pourquoi MySQL ?

- Relations claires entre utilisateurs / bars / votes
- Données structurées et fiables
- Idéal pour filtres complexes

### Pourquoi Leaflet?

- Cartographie flexible
- Intégration simple avec React

---

## II - Sécurité

### Mesures de sécurité mises en place

- **Chiffrement des mots de passe** : bcrypt
- **JWT** pour l'authentification
- **Limite de votes par minute** : anti-spam
- **Vérification géographique** : vote autorisé uniquement proche du bar
- **Protection API** : rate limiting + CORS

---

# **Conclusion**

Ce projet permet de démontrer des compétences complètes en développement web full-stack :

- Conception technique & UX
- Réalisation d'une API REST robuste
- Gestion du temps réel
- Mise en place d'une architecture moderne
- Intégration front web + mobile

---

# **Annexes**

*À compléter*

[Kanban — To‑do list MVP (Bar Explorer)](https://www.notion.so/Kanban-To-do-list-MVP-Bar-Explorer-a4a3e07d0be7442a900afed944771db6?pvs=21)