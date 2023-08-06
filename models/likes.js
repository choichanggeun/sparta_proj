'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Users, {
        // 2. Users 모델에게 N:1 관계 설정을 합니다.
        targetKey: 'userId', //  Users 모델의 userId 컬럼을
        foreignKey: 'UserId', //
      });

      this.belongsTo(models.Posts, {
        // 2. Posts 모델에게 N:1 관계 설정을 합니다.
        targetKey: 'postId', //  Posts 모델의 postId 컬럼을
        foreignKey: 'PostId', //
      });
    }
  }
  Likes.init(
    {
      likeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      UserId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'userId',
        },
        onDelete: 'CASCADE',
      },
      PostId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Posts',
          key: 'postId',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false, // NOT NULL
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Likes',
    }
  );
  return Likes;
};
