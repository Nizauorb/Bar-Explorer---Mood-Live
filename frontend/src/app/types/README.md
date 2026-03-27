# Architecture des Types

## Structure professionnelle par domaine

### 📁 Fichiers
- **`auth.ts`** : Types liés à l'authentification
- **`bar.ts`** : Types liés aux bars, votes et utilisateurs
- **`favorite.ts`** : Types liés aux favoris
- **`context.ts`** : Types liés au contexte React
- **`index.ts`** : Point d'entrée unique (réexporte tout)

### 🎯 Avantages
- **Organisation claire** : Chaque domaine a son fichier
- **Maintenance facile** : Pas de fichier monolithique
- **Réutilisation** : Import unique depuis `../types`
- **Évolutivité** : Facile à étendre

### 📦 Utilisation
```typescript
// Import unique
import { User, Bar, VoteRequest, AuthResponse } from '../types';

// Ou import spécifique
import { User, AuthResponse } from '../types/auth';
```

### 🏗️ Principe
Un type = un domaine logique. Pas de duplication, organisation claire.
