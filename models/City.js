const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const Province = require('./Province')

const City = sequelize.define(
  'City',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    province_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'provinces',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
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
    tableName: 'cities',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

// Define association
City.belongsTo(Province, { foreignKey: 'province_id' })
Province.hasMany(City, { foreignKey: 'province_id' })

module.exports = City
