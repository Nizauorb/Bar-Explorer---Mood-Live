import { DataTypes, Model, InferAttributes, InferCreationAttributes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

interface FavoriteAttributes {
  id: string;
  user_id: string;
  bar_id: string;
}

interface FavoriteCreationAttributes extends Optional<FavoriteAttributes, 'id'> {}

export class Favorite extends Model<InferAttributes<Favorite>, FavoriteCreationAttributes> implements FavoriteAttributes {
  public id!: string;
  public user_id!: string;
  public bar_id!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Favorite.init(
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
    tableName: 'favorites',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'bar_id'],
      },
      {
        fields: ['user_id'],
      },
      {
        fields: ['bar_id'],
      },
    ],
  }
);

export default Favorite;