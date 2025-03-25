const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const User = require('./User')
const Province = require('./Province')
const City = require('./City')

const Post = sequelize.define(
  'Post',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    province_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'provinces',
        key: 'id',
      },
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cities',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    votes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    comment_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'posts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

// Define associations
Post.belongsTo(User, { foreignKey: 'user_id' })
User.hasMany(Post, { foreignKey: 'user_id' })

Post.belongsTo(Province, { foreignKey: 'province_id' })
Province.hasMany(Post, { foreignKey: 'province_id' })

Post.belongsTo(City, { foreignKey: 'city_id' })
City.hasMany(Post, { foreignKey: 'city_id' })

module.exports = Post
