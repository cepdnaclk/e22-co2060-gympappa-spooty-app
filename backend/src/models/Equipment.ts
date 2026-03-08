import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Equipment extends Model {
  public id!: number;
  public sport_id!: number;
  public name!: string;
  public total_quantity!: number;
  public remaining_quantity!: number;
}

Equipment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sport_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    remaining_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Equipment',
    tableName: 'equipment',   // ✅ matches the actual PostgreSQL table
    timestamps: false,         // matches createdAt and updatedAt columns
  }
);

export default Equipment;
