const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const User = require('./User')
const Post = require('./Post')

const Comment = sequelize.define(
  'Comment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'comments',
        key: 'id',
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    votes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'comments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

// Define associations
Comment.belongsTo(User, { foreignKey: 'user_id' })
User.hasMany(Comment, { foreignKey: 'user_id' })

Comment.belongsTo(Post, { foreignKey: 'post_id' })
Post.hasMany(Comment, { foreignKey: 'post_id' })

Comment.belongsTo(Comment, { as: 'Parent', foreignKey: 'parent_id' })
Comment.hasMany(Comment, { as: 'Replies', foreignKey: 'parent_id' })

module.exports = Comment
