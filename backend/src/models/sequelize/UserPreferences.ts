import { DataTypes, Model, InferAttributes, InferCreationAttributes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

interface UserPreferencesAttributes {
  id: string;
  user_id: string;
  music_genres: string;
  go_out_frequency: 'jamais' | 'rarement' | 'occasionnellement' | 'souvent' | 'tres_souvent';
  preferred_price_range: '€' | '€€' | '€€€';
  notifications_enabled: boolean;
  location_sharing: boolean;
}

interface UserPreferencesCreationAttributes extends Optional<UserPreferencesAttributes, 'id' | 'notifications_enabled' | 'location_sharing'> {}

export class UserPreferences extends Model<InferAttributes<UserPreferences>, UserPreferencesCreationAttributes> implements UserPreferencesAttributes {
  public id!: string;
  public user_id!: string;
  public music_genres!: string;
  public go_out_frequency!: 'jamais' | 'rarement' | 'occasionnellement' | 'souvent' | 'tres_souvent';
  public preferred_price_range!: '€' | '€€' | '€€€';
  public notifications_enabled!: boolean;
  public location_sharing!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

UserPreferences.init(
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
    music_genres: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    go_out_frequency: {
      type: DataTypes.ENUM('jamais', 'rarement', 'occasionnellement', 'souvent', 'tres_souvent'),
      defaultValue: 'occasionnellement',
    },
    preferred_price_range: {
      type: DataTypes.ENUM('€', '€€', '€€€'),
      defaultValue: '€€',
    },
    notifications_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    location_sharing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: 'user_preferences',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default UserPreferences;