const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Province = sequelize.define(
  'Province',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'provinces',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

module.exports = Province
