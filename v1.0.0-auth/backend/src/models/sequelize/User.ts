import { DataTypes, Model, InferAttributes, InferCreationAttributes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

interface UserAttributes {
  id: string;
  email: string;
  pseudo: string;
  password_hash?: string;
  avatar?: string;
  google_id?: string;
  email_verified: boolean;
  last_login?: Date;
  is_active: boolean;
}

// Ligne manquante qui résout tout :
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'email_verified' | 'last_login' | 'is_active'> {}

export class User extends Model<InferAttributes<User>, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public pseudo!: string;
  public password_hash?: string;
  public avatar?: string;
  public google_id?: string;
  public email_verified!: boolean;
  public last_login?: Date;
  public is_active!: boolean;

  // Timestamps automatiques (pas dans l'interface principale)
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    pseudo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    google_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default User;