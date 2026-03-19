import { DataTypes, Model, InferAttributes, InferCreationAttributes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

interface BarAttributes {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  price_range: '€' | '€€' | '€€€';
  tags: string;
  description?: string;
  hours: string;
  services: string;
  image_url?: string;
  phone?: string;
  website?: string;
  current_mood: number;
  current_crowd: 'faible' | 'moyenne' | 'pleine';
  vote_count: number;
  is_active: boolean;
}

interface BarCreationAttributes extends Optional<BarAttributes, 'id' | 'description' | 'image_url' | 'phone' | 'website' | 'current_mood' | 'current_crowd' | 'vote_count' | 'is_active'> {}

export class Bar extends Model<InferAttributes<Bar>, BarCreationAttributes> implements BarAttributes {
  public id!: string;
  public name!: string;
  public address!: string;
  public latitude!: number;
  public longitude!: number;
  public price_range!: '€' | '€€' | '€€€';
  public tags!: string;
  public description?: string;
  public hours!: string;
  public services!: string;
  public image_url?: string;
  public phone?: string;
  public website?: string;
  public current_mood!: number;
  public current_crowd!: 'faible' | 'moyenne' | 'pleine';
  public vote_count!: number;
  public is_active!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Bar.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    price_range: {
      type: DataTypes.ENUM('€', '€€', '€€€'),
      allowNull: false,
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hours: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    services: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    current_mood: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    current_crowd: {
      type: DataTypes.ENUM('faible', 'moyenne', 'pleine'),
      defaultValue: 'moyenne',
    },
    vote_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    tableName: 'bars',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['name'],
      },
      {
        fields: ['price_range'],
      },
      {
        fields: ['latitude', 'longitude'],
      },
    ],
  }
);

export default Bar;