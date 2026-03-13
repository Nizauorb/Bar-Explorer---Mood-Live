import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

// Interface pour le modèle User
export interface UserInstance extends Model {
  id: number;
  email: string;
  username: string;
  password: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export const User = sequelize.define<UserInstance>('User', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50],
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [6, 255],
    },
  },
  avatar_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Interface pour le modèle Bar
export interface BarInstance extends Model {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  phone?: string;
  website?: string;
  created_at: Date;
  updated_at: Date;
}

export const Bar = sequelize.define<BarInstance>('Bar', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
    validate: {
      min: -90,
      max: 90,
    },
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
    validate: {
      min: -180,
      max: 180,
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  tableName: 'bars',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Interface pour le modèle Vote
export interface VoteInstance extends Model {
  id: number;
  user_id: number;
  bar_id: number;
  ambiance_score: number;
  affluence_level: 'faible' | 'moyenne' | 'pleine';
  created_at: Date;
}

export const Vote = sequelize.define<VoteInstance>('Vote', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  bar_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Bar,
      key: 'id',
    },
  },
  ambiance_score: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 5,
    },
  },
  affluence_level: {
    type: DataTypes.ENUM('faible', 'moyenne', 'pleine'),
    allowNull: false,
  },
}, {
  tableName: 'votes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

// Interface pour le modèle Favorite
export interface FavoriteInstance extends Model {
  id: number;
  user_id: number;
  bar_id: number;
  created_at: Date;
}

export const Favorite = sequelize.define<FavoriteInstance>('Favorite', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  bar_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Bar,
      key: 'id',
    },
  },
}, {
  tableName: 'favorites',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

// Définition des associations
User.hasMany(Vote, { foreignKey: 'user_id', as: 'votes' });
Vote.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Bar.hasMany(Vote, { foreignKey: 'bar_id', as: 'votes' });
Vote.belongsTo(Bar, { foreignKey: 'bar_id', as: 'bar' });

User.hasMany(Favorite, { foreignKey: 'user_id', as: 'favorites' });
Favorite.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Bar.hasMany(Favorite, { foreignKey: 'bar_id', as: 'favorites' });
Favorite.belongsTo(Bar, { foreignKey: 'bar_id', as: 'bar' });
