import { DataTypes, Model, InferAttributes, InferCreationAttributes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

interface VoteAttributes {
  id: string;
  user_id: string;
  bar_id: string;
  mood: number;
  crowd: 'faible' | 'moyenne' | 'pleine';
  comment?: string;
  user_latitude?: number;
  user_longitude?: number;
}

interface VoteCreationAttributes extends Optional<VoteAttributes, 'id' | 'comment' | 'user_latitude' | 'user_longitude'> {}

export class Vote extends Model<InferAttributes<Vote>, VoteCreationAttributes> implements VoteAttributes {
  public id!: string;
  public user_id!: string;
  public bar_id!: string;
  public mood!: number;
  public crowd!: 'faible' | 'moyenne' | 'pleine';
  public comment?: string;
  public user_latitude?: number;
  public user_longitude?: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Vote.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    bar_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'bars',
        key: 'id',
      },
    },
    mood: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        min: 0,
        max: 5,
      },
    },
    crowd: {
      type: DataTypes.ENUM('faible', 'moyenne', 'pleine'),
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    user_latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    user_longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
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
    tableName: 'votes',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['bar_id'],
      },
      {
        fields: ['user_id'],
      },
      {
        fields: ['created_at'],
      },
    ],
  }
);

export default Vote;